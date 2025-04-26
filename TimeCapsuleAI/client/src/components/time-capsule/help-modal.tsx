import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTimeCapsule } from "@/context/time-capsule-context";

export function HelpModal() {
  const { showHelpModal, setShowHelpModal } = useTimeCapsule();

  return (
    <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">How to Use Time Capsule AI</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto py-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Choosing a Mode</h3>
            <p className="text-sm text-gray-600">
              Toggle between "Past Me" to reflect on historical decisions or "Future Me" to explore potential outcomes.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Setting a Time Frame</h3>
            <p className="text-sm text-gray-600">
              Select how far back or ahead you want to look, from 1 month to 5 years.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Selecting a Context</h3>
            <p className="text-sm text-gray-600">
              Choose Product, Team, Revenue, or Strategy to focus your conversation on specific aspects of your business.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Current Situation</h3>
            <p className="text-sm text-gray-600">
              Describe your current scenario to provide context for the AI to generate more relevant responses.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Conversation Insights</h3>
            <p className="text-sm text-gray-600">
              After your conversation, review an AI-generated summary highlighting key points, differences, and opportunities.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Saving and Exporting</h3>
            <p className="text-sm text-gray-600">
              Save your conversations to revisit later or export them as HTML for sharing with your team.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => setShowHelpModal(false)} 
            className="w-full"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
