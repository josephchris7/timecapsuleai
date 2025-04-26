import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTimeCapsule } from "@/context/time-capsule-context";
import { scrollToBottom, formatTimeFrame, formatContext } from "@/lib/utils";
import { generateResponse, generateInsights } from "@/lib/openai";
import { Insights } from "@/lib/openai";
import { SaveIcon, DownloadIcon, XIcon, SendIcon } from "lucide-react";
import { saveConversation } from "@/lib/openai";

export function ConversationInterface() {
  const {
    mode,
    timeFrame,
    selectedContext,
    currentSituation,
    isConversationActive,
    setIsConversationActive,
    messages,
    addMessage,
    setInsights,
    setShowInsightsPanel,
    isProcessing,
    setIsProcessing,
    timeFrameOptions,
    exportConversation
  } = useTimeCapsule();

  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom(messagesContainerRef.current);
  }, [messages]);

  if (!isConversationActive) {
    return null;
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = inputValue.trim();
    if (!message || isProcessing) return;
    
    // Add user message to chat
    addMessage("user", message);
    
    // Clear input
    setInputValue("");
    
    // Set processing state
    setIsProcessing(true);
    
    try {
      // Generate AI response
      const response = await generateResponse({
        mode,
        timeFrame,
        context: selectedContext || "",
        currentSituation,
        message,
        previousMessages: messages
      });
      
      // Add AI response to chat
      addMessage("ai", response.response);
      
      // Generate insights if this is the 3rd message exchange (1 initial + 1 user + 1 AI)
      if (messages.length >= 3) {
        generateConversationInsights();
      }
    } catch (error) {
      console.error("Error generating response:", error);
      addMessage("ai", "I'm sorry, I couldn't generate a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateConversationInsights = async () => {
    try {
      const insights = await generateInsights({
        mode,
        timeFrame,
        context: selectedContext || "",
        currentSituation,
        messages: [...messages]
      });
      
      setInsights(insights);
      setShowInsightsPanel(true);
    } catch (error) {
      console.error("Error generating insights:", error);
    }
  };

  const handleSaveConversation = async () => {
    try {
      await saveConversation({
        mode,
        timeFrame,
        context: selectedContext || "",
        currentSituation,
        messages
      });
      
      alert("Conversation saved successfully!");
    } catch (error) {
      console.error("Error saving conversation:", error);
      alert("Failed to save conversation.");
    }
  };

  const handleCloseConversation = () => {
    setIsConversationActive(false);
    setShowInsightsPanel(false);
  };

  const modeText = mode === "past" ? "Past Me" : "Future Me";
  const timeText = formatTimeFrame(timeFrame);
  const contextText = selectedContext ? formatContext(selectedContext) : "";
  const preposition = mode === "past" ? "Ago" : "From Now";

  return (
    <Card className="rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="material-icons">
              {mode === "past" ? "history" : "update"}
            </span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold">Conversation with {modeText}</h3>
            <p className="text-xs text-gray-500">{timeText} {preposition} • {contextText} Context</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            title="Save Conversation"
            onClick={handleSaveConversation}
          >
            <SaveIcon className="h-5 w-5 text-gray-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            title="Export Conversation"
            onClick={exportConversation}
          >
            <DownloadIcon className="h-5 w-5 text-gray-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            title="Close Conversation"
            onClick={handleCloseConversation}
          >
            <XIcon className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}
      >
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role === "user" ? "user-message" : "ai-message"}`}>
            {message.role === "user" ? (
              <div className="flex items-start justify-end">
                <div className="max-w-3xl rounded-lg bg-[#E9F2FF] px-4 py-2 text-sm">
                  <p>{message.content}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center ml-2">
                  <span className="text-xs font-medium">JS</span>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2">
                  <span className="material-icons text-sm">
                    {mode === "past" ? "history" : "update"}
                  </span>
                </div>
                <div className="max-w-3xl rounded-lg bg-[#F3F4F6] px-4 py-2 text-sm">
                  <p>{message.content}</p>
                </div>
              </div>
            )}
            <span className={`text-xs text-gray-400 mt-1 ${message.role === "user" ? "mr-10 text-right block" : "ml-10"}`}>
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        ))}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="chat-message ai-message">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2">
                <span className="material-icons text-sm">
                  {mode === "past" ? "history" : "update"}
                </span>
              </div>
              <div className="max-w-xs rounded-lg bg-[#F3F4F6] px-4 py-2 text-sm">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 rounded-full"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full w-10 h-10 p-0"
            disabled={isProcessing || !inputValue.trim()}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
