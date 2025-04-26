import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Insights } from "@/lib/openai";

interface Message {
  role: string; // 'user' or 'ai'
  content: string;
  timestamp: string;
}

interface TimeFrameOption {
  value: string;
  label: string;
}

interface ContextOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface TimeCapsuleContextType {
  // Settings
  mode: string;
  setMode: (mode: string) => void;
  timeFrame: string;
  setTimeFrame: (timeFrame: string) => void;
  selectedContext: string | null;
  setSelectedContext: (context: string | null) => void;
  currentSituation: string;
  setCurrentSituation: (situation: string) => void;
  
  // Conversation state
  isConversationActive: boolean;
  setIsConversationActive: (active: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (role: string, content: string) => void;
  
  // Insights
  insights: Insights | null;
  setInsights: (insights: Insights | null) => void;
  showInsightsPanel: boolean;
  setShowInsightsPanel: (show: boolean) => void;
  
  // Help modal
  showHelpModal: boolean;
  setShowHelpModal: (show: boolean) => void;
  
  // Processing state
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  
  // Constants
  timeFrameOptions: TimeFrameOption[];
  contextOptions: ContextOption[];
  
  // Export
  exportConversation: () => void;
}

const timeFrameOptions: TimeFrameOption[] = [
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "2y", label: "2 Years" },
  { value: "5y", label: "5 Years" },
];

const contextOptions: ContextOption[] = [
  { 
    value: "product", 
    label: "Product", 
    icon: "category",
    description: "Discuss product strategy, features, and roadmap" 
  },
  { 
    value: "team", 
    label: "Team", 
    icon: "people",
    description: "Reflect on team dynamics, hiring, and organization" 
  },
  { 
    value: "revenue", 
    label: "Revenue", 
    icon: "trending_up",
    description: "Analyze financial performance and forecasts" 
  },
  { 
    value: "strategy", 
    label: "Strategy", 
    icon: "lightbulb",
    description: "Evaluate business strategy and market positioning" 
  },
];

const TimeCapsuleContext = createContext<TimeCapsuleContextType | undefined>(undefined);

export function TimeCapsuleProvider({ children }: { children: ReactNode }) {
  // Settings
  const [mode, setMode] = useState<string>("past");
  const [timeFrame, setTimeFrame] = useState<string>("1y");
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [currentSituation, setCurrentSituation] = useState<string>("");
  
  // Conversation state
  const [isConversationActive, setIsConversationActive] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Insights
  const [insights, setInsights] = useState<Insights | null>(null);
  const [showInsightsPanel, setShowInsightsPanel] = useState<boolean>(false);
  
  // Help modal
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const addMessage = (role: string, content: string) => {
    const newMessage = {
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };
  
  const exportConversation = () => {
    // Create HTML string for export
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>Time Capsule AI Conversation</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { background-color: #f0f0f0; padding: 10px; margin-bottom: 20px; }
    .message { margin-bottom: 10px; padding: 10px; border-radius: 5px; }
    .user { background-color: #E9F2FF; margin-left: 20%; }
    .ai { background-color: #F3F4F6; margin-right: 20%; }
    .insights { margin-top: 20px; padding: 10px; background-color: #f9f9f9; }
    .insights h2 { margin-top: 0; }
    .insights ul { padding-left: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Time Capsule AI Conversation</h1>
    <p>Mode: ${mode === 'past' ? 'Past Me' : 'Future Me'}</p>
    <p>Time Frame: ${timeFrameOptions.find(t => t.value === timeFrame)?.label}</p>
    <p>Context: ${contextOptions.find(c => c.value === selectedContext)?.label}</p>
    <p>Current Situation: ${currentSituation}</p>
    <p>Generated on: ${new Date().toLocaleString()}</p>
  </div>
  <div class="conversation">`;
    
    // Add messages
    messages.forEach(message => {
      const messageClass = message.role === 'user' ? 'user' : 'ai';
      const timestamp = new Date(message.timestamp).toLocaleString();
      
      html += `
    <div class="message ${messageClass}">
      <p>${message.content}</p>
      <small>${timestamp}</small>
    </div>`;
    });
    
    html += `
  </div>`;
    
    // Add insights if available
    if (insights) {
      html += `
  <div class="insights">
    <h2>Conversation Insights</h2>
    
    <h3>Key Differences</h3>
    <ul>`;
      
      insights.keyDifferences.forEach(item => {
        html += `
      <li>${item}</li>`;
      });
      
      html += `
    </ul>
    
    <h3>Successful Predictions</h3>
    <ul>`;
      
      insights.successfulPredictions.forEach(item => {
        html += `
      <li>${item}</li>`;
      });
      
      html += `
    </ul>
    
    <h3>Missed Opportunities</h3>
    <ul>`;
      
      insights.missedOpportunities.forEach(item => {
        html += `
      <li>${item}</li>`;
      });
      
      html += `
    </ul>
  </div>`;
    }
    
    html += `
</body>
</html>`;
    
    // Create a Blob from the HTML string
    const blob = new Blob([html], { type: 'text/html' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-capsule-conversation-${new Date().toISOString().split('T')[0]}.html`;
    
    // Append the link to the document
    document.body.appendChild(a);
    
    // Trigger a click on the link
    a.click();
    
    // Remove the link from the document
    document.body.removeChild(a);
    
    // Release the URL object
    URL.revokeObjectURL(url);
  };
  
  const value = {
    mode,
    setMode,
    timeFrame,
    setTimeFrame,
    selectedContext,
    setSelectedContext,
    currentSituation,
    setCurrentSituation,
    isConversationActive,
    setIsConversationActive,
    messages,
    setMessages,
    addMessage,
    insights,
    setInsights,
    showInsightsPanel,
    setShowInsightsPanel,
    showHelpModal,
    setShowHelpModal,
    isProcessing,
    setIsProcessing,
    timeFrameOptions,
    contextOptions,
    exportConversation
  };
  
  return (
    <TimeCapsuleContext.Provider value={value}>
      {children}
    </TimeCapsuleContext.Provider>
  );
}

export function useTimeCapsule() {
  const context = useContext(TimeCapsuleContext);
  if (context === undefined) {
    throw new Error("useTimeCapsule must be used within a TimeCapsuleProvider");
  }
  return context;
}
