import React from "react";
import { 
  Home, 
  Cpu, 
  Layers, 
  Activity, 
  Star, 
  HelpCircle, 
  BookOpen, 
  Info, 
  Settings, 
  Menu, 
  X,
  Search
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
  onSearchClick: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isAdminLoggedIn,
  onAdminClick,
  onSearchClick,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "intro", label: "CPU Scheduling", icon: Cpu },
    { id: "fcfs", label: "FCFS Algorithm", icon: Layers },
    { id: "sjf", label: "SJF Algorithm", icon: Activity },
    { id: "priority", label: "Priority Scheduling", icon: Star },
    { id: "parta", label: "Part A · Sync Guide", icon: BookOpen },
    { id: "partb", label: "Part B · Memory Guide", icon: Layers },
    { id: "quiz", label: "Interactive Quiz", icon: HelpCircle },
    { id: "about", label: "About / Guide", icon: Info },
  ];

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    setSidebarOpen(false); // Close on mobile navigation
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-gray-950 border-b border-gray-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Cpu className="w-6 h-6 text-indigo-500 animate-pulse" />
          <span className="font-sans font-bold text-base text-gray-100 tracking-tight">
            Scheduling & Memory
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
            title="Search Questions & Notes"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-900 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 border-b border-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-sm text-gray-100 tracking-tight">
                  Scheduling & Memory
                </span>
                <span className="text-[10px] text-gray-500 font-mono tracking-wider">
                  OS LAB SYSTEM
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-1.5 text-gray-500 hover:text-gray-300 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Shortcut */}
          <div className="px-4 py-3 hidden lg:block">
            <button
              onClick={onSearchClick}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-left text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-all"
            >
              <Search className="w-4 h-4 text-gray-600" />
              <span>Search index...</span>
              <span className="ml-auto bg-gray-950 text-[10px] border border-gray-800 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                Ctrl K
              </span>
            </button>
          </div>

          {/* Menu links */}
          <nav className="flex-1 px-4 py-3 space-y-1">
            <p className="px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">
              Menu Navigation
            </p>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm"
                      : "text-gray-400 hover:text-gray-100 hover:bg-gray-900/60 border border-transparent"
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-400" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin and session controls */}
        <div className="p-4 border-t border-gray-900 space-y-2 bg-gray-950/80">
          <button
            onClick={onAdminClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === "admin"
                ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
                : "text-gray-500 hover:text-gray-300 bg-gray-900/40 hover:bg-gray-900 border border-gray-900"
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${currentTab === "admin" ? "text-emerald-400" : "text-gray-600"}`} />
            <div className="flex flex-col items-start">
              <span className="font-semibold">{isAdminLoggedIn ? "Admin Dashboard" : "Admin Console"}</span>
              <span className="text-[9px] opacity-75">{isAdminLoggedIn ? "Logged In" : "Click to log in"}</span>
            </div>
            {isAdminLoggedIn && (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>
          
          <div className="px-3 pt-1 text-[9px] text-gray-600 text-center font-mono">
            <span>v1.2.0 • OS Courseware</span>
          </div>
        </div>
      </aside>
    </>
  );
};
