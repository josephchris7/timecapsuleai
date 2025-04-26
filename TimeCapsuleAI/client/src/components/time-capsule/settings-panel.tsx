import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTimeCapsule } from "@/context/time-capsule-context";
import { Switch } from "@/components/ui/switch";
import { PlayIcon } from "lucide-react";
import { generateResponse } from "@/lib/openai";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const {
    mode,
    setMode,
    timeFrame,
    setTimeFrame,
    selectedContext,
    setSelectedContext,
    currentSituation,
    setCurrentSituation,
    timeFrameOptions,
    contextOptions,
    setIsConversationActive,
    addMessage,
    setMessages,
    setIsProcessing
  } = useTimeCapsule();

  const handleStartConversation = async () => {
    if (!selectedContext) {
      alert("Please select a context before starting a conversation.");
      return;
    }

    if (!currentSituation.trim()) {
      alert("Please describe your current situation to provide context.");
      return;
    }

    // Clear previous messages and set conversation active
    setMessages([]);
    setIsConversationActive(true);
    
    // Generate initial AI message
    const modeText = mode === "past" ? "past" : "future";
    const timeText = timeFrameOptions.find(t => t.value === timeFrame)?.label.toLowerCase() || timeFrame;
    const contextText = selectedContext;
    const initialMessage = `Welcome to Time Capsule AI. I'll be simulating a conversation with your ${modeText} self from ${timeText} ${mode === "past" ? "ago" : "from now"} about your ${contextText}. How can I help you today?`;
    
    // Add initial AI message
    addMessage("ai", initialMessage);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Time Capsule Settings</h2>
        
        {/* Mode Selection Toggle and Time Frame */}
        <div className="flex flex-col md:flex-row md:items-center mb-6 gap-6">
          <div className="w-full md:w-1/2">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Conversation Mode</Label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Past Me</span>
              <Switch
                checked={mode === "future"}
                onCheckedChange={(checked) => setMode(checked ? "future" : "past")}
                className="mx-2"
              />
              <span className="text-sm font-medium text-gray-700">Future Me</span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <Label htmlFor="time-frame" className="block text-sm font-medium text-gray-700 mb-2">
              Time Frame
            </Label>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger>
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                {timeFrameOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Context Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {contextOptions.map((context) => (
            <div
              key={context.value}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition hover:border-primary hover:bg-blue-50",
                selectedContext === context.value && "border-primary bg-blue-50"
              )}
              onClick={() => setSelectedContext(context.value)}
            >
              <div className="flex items-center mb-2">
                <span className="material-icons text-primary mr-2">{context.icon}</span>
                <h3 className="text-sm font-medium">{context.label}</h3>
              </div>
              <p className="text-xs text-gray-500">{context.description}</p>
            </div>
          ))}
        </div>
        
        {/* Current Situation Input */}
        <div className="mb-6">
          <Label htmlFor="current-situation" className="block text-sm font-medium text-gray-700 mb-2">
            Current Situation <span className="text-gray-500 text-xs">(Provide context about your current scenario)</span>
          </Label>
          <Textarea
            id="current-situation"
            rows={3}
            className="resize-none"
            placeholder="Describe your current situation, challenges, or questions..."
            value={currentSituation}
            onChange={(e) => setCurrentSituation(e.target.value)}
          />
        </div>
        
        {/* Start Conversation Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleStartConversation}
            className="inline-flex items-center"
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            Start Conversation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
