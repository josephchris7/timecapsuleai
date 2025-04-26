import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimeCapsule } from "@/context/time-capsule-context";
import { XIcon, SaveIcon } from "lucide-react";
import { saveConversation } from "@/lib/openai";

export function InsightsPanel() {
  const {
    insights,
    showInsightsPanel,
    setShowInsightsPanel,
    mode,
    timeFrame,
    selectedContext,
    currentSituation,
    messages
  } = useTimeCapsule();

  if (!showInsightsPanel || !insights) {
    return null;
  }

  const handleSaveInsights = async () => {
    try {
      await saveConversation({
        mode,
        timeFrame,
        context: selectedContext || "",
        currentSituation,
        messages,
        insights
      });
      
      alert("Insights saved successfully!");
    } catch (error) {
      console.error("Error saving insights:", error);
      alert("Failed to save insights.");
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Conversation Insights</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowInsightsPanel(false)}
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Key Differences</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
              {insights.keyDifferences.map((item, index) => (
                <li key={`diff-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md">
            <h3 className="text-sm font-medium text-green-800 mb-2">Successful Predictions</h3>
            <ul className="text-sm text-green-700 space-y-1 list-disc pl-5">
              {insights.successfulPredictions.map((item, index) => (
                <li key={`pred-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-md">
            <h3 className="text-sm font-medium text-amber-800 mb-2">Missed Opportunities</h3>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
              {insights.missedOpportunities.map((item, index) => (
                <li key={`opp-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={handleSaveInsights}
            className="inline-flex items-center"
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
