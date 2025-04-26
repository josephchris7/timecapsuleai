import { useTimeCapsule } from "@/context/time-capsule-context";

export function Header() {
  const { setShowHelpModal } = useTimeCapsule();
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">history</span>
            <h1 className="text-xl font-semibold text-gray-900">AI365 | Time Capsule AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowHelpModal(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons">help_outline</span>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <span className="material-icons">settings</span>
            </button>
            <div className="relative">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  JS
                </div>
                <span className="hidden md:inline-block text-sm font-medium">John Smith</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
