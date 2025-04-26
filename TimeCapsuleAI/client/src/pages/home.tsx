import { Header } from "@/components/time-capsule/header";
import { SettingsPanel } from "@/components/time-capsule/settings-panel";
import { ConversationInterface } from "@/components/time-capsule/conversation-interface";
import { InsightsPanel } from "@/components/time-capsule/insights-panel";
import { HelpModal } from "@/components/time-capsule/help-modal";
import { TimeCapsuleProvider } from "@/context/time-capsule-context";

export default function Home() {
  return (
    <TimeCapsuleProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SettingsPanel />
          <ConversationInterface />
          <InsightsPanel />
          <HelpModal />
        </main>
      </div>
    </TimeCapsuleProvider>
  );
}
