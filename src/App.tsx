import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Cpu, 
  Search, 
  HelpCircle, 
  ArrowUp, 
  X, 
  BookOpen, 
  Layers, 
  Sun, 
  Moon, 
  Sparkles,
  SearchCode
} from "lucide-react";
import { ToastProvider, useToast } from "./components/Toast";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { Intro } from "./pages/Intro";
import { AlgorithmDetail } from "./pages/AlgorithmDetail";
import { Quiz } from "./pages/Quiz";
import { PartA } from "./pages/PartA";
import { PartB } from "./pages/PartB";
import { AdminDashboard } from "./pages/AdminDashboard";
import { About } from "./pages/About";
import { VivaQuestion, AlgorithmNotes } from "./types";

function AppContent() {
  const { showToast } = useToast();
  
  // Navigation active state
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Extra Features States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to gorgeous dark mode
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  
  // Admin Login persistent session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("cpu_scheduling_admin") === "true";
  });

  const handleAdminLoginStatus = (status: boolean) => {
    setIsAdminLoggedIn(status);
    if (status) {
      localStorage.setItem("cpu_scheduling_admin", "true");
    } else {
      localStorage.removeItem("cpu_scheduling_admin");
    }
  };

  // Unified Search Overlay State
  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");
  const [allQuestions, setAllQuestions] = useState<VivaQuestion[]>([]);
  const [allNotes, setAllNotes] = useState<AlgorithmNotes[]>([]);

  // Track page scroll to manage Scroll Progress & Back To Top
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }

      // Show back to top if scrolled past 400px
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut Ctrl + K to trigger Unified search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOverlayOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch index for unified searching
  useEffect(() => {
    if (searchOverlayOpen) {
      axios.get("/api/questions")
        .then(res => setAllQuestions(res.data))
        .catch(() => {});
      axios.get("/api/notes")
        .then(res => setAllNotes(res.data))
        .catch(() => {});
    }
  }, [searchOverlayOpen]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Highlight matches inside Unified Search Box
  const highlightSearch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-500/30 text-amber-300 font-bold px-0.5 rounded-sm">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Filter unified records
  const matchedQuestions = allQuestions.filter(q => 
    q.question.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
    q.answer.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    q.title.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const matchedNotes = allNotes.filter(n => 
    n.algorithm.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    n.introduction.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    n.working.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row font-sans transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gray-950 text-gray-200" 
        : "bg-gray-50 text-gray-800"
    }`}>
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Left Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => setCurrentTab("admin")}
        onSearchClick={() => setSearchOverlayOpen(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Viewport panel */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Control Header bar (Desktop & Mobile view settings) */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isDarkMode ? "border-gray-900 bg-gray-950/80" : "border-gray-200 bg-white"
        } sticky top-0 z-30 backdrop-blur-md`}>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
              Active Module: <span className="text-gray-300 font-sans">{currentTab.toUpperCase()}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 no-print">
            {/* Quick Unified Search button */}
            <button
              onClick={() => setSearchOverlayOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
              title="Search Questions & Notes (Ctrl K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode toggle (Extra Feature) */}
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                showToast(`Switched to ${!isDarkMode ? "Cosmic VS-Code Dark" : "Clean Light Mode"}`, "info");
              }}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
              title="Toggle theme presets"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic page contents body */}
        <div className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
          {currentTab === "home" && <Home setCurrentTab={setCurrentTab} />}
          {currentTab === "intro" && <Intro />}
          {currentTab === "fcfs" && <AlgorithmDetail algorithmId="fcfs" />}
          {currentTab === "sjf" && <AlgorithmDetail algorithmId="sjf" />}
          {currentTab === "priority" && <AlgorithmDetail algorithmId="priority" />}
          {currentTab === "quiz" && <Quiz />}
          {currentTab === "parta" && <PartA />}
          {currentTab === "partb" && <PartB />}
          {currentTab === "about" && <About />}
          {currentTab === "admin" && (
            <AdminDashboard 
              isAdminLoggedIn={isAdminLoggedIn} 
              setIsAdminLoggedIn={handleAdminLoginStatus} 
            />
          )}
        </div>

        {/* Sticky footer */}
        <footer className={`px-6 py-5 text-center text-[10px] font-mono border-t ${
          isDarkMode ? "border-gray-900 bg-gray-950/60 text-gray-600" : "border-gray-200 bg-gray-100 text-gray-400"
        } mt-auto no-print`}>
          <span>CPU Scheduling & Memory Management System © 2026 Academic Lab Courseware</span>
        </footer>
      </main>

      {/* Unified Search Modal Overlay */}
      {searchOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 no-print">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSearchOverlayOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
            {/* Search Input block */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-3 bg-gray-950">
              <Search className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Type to search scheduling notes or viva library..."
                className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 text-white placeholder-gray-500 py-1"
              />
              <button 
                onClick={() => setSearchOverlayOpen(false)}
                className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Block */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {globalSearchQuery.trim() === "" ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <SearchCode className="w-10 h-10 text-gray-800 mb-2" />
                  <p className="text-xs text-gray-500">Type a keyword to search across the entire laboratory syllabus...</p>
                </div>
              ) : (matchedQuestions.length === 0 && matchedNotes.length === 0) ? (
                <div className="text-center py-10">
                  <p className="text-xs text-gray-500">No matching questions or topics found.</p>
                </div>
              ) : (
                <>
                  {/* Notes Matches */}
                  {matchedNotes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                        Syllabus Algorithms
                      </h4>
                      <div className="space-y-1.5">
                        {matchedNotes.map(n => (
                          <button
                            key={n.id}
                            onClick={() => {
                              setCurrentTab(n.id);
                              setSearchOverlayOpen(false);
                            }}
                            className="w-full text-left p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 border border-gray-900 transition-colors flex items-start gap-3"
                          >
                            <Layers className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-white block">{n.algorithm}</span>
                              <p className="text-[10px] text-gray-400 line-clamp-2">
                                {highlightSearch(n.introduction, globalSearchQuery)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions Matches */}
                  {matchedQuestions.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                        Viva Questions
                      </h4>
                      <div className="space-y-1.5">
                        {matchedQuestions.map(q => (
                          <button
                            key={q.id}
                            onClick={() => {
                              setCurrentTab("parta");
                              setSearchOverlayOpen(false);
                            }}
                            className="w-full text-left p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 border border-gray-900 transition-colors flex items-start gap-3"
                          >
                            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-white block">Q. {highlightSearch(q.question, globalSearchQuery)}</span>
                              <p className="text-[10px] text-gray-400 line-clamp-2">
                                {highlightSearch(q.answer, globalSearchQuery)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-2.5 border-t border-gray-900 bg-gray-950 text-[10px] text-gray-600 text-center font-mono">
              ESC to close • Press Arrow keys to move
            </div>
          </div>
        </div>
      )}

      {/* Back to top (Floating button) */}
      {showBackToTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg transition-transform hover:scale-105 no-print"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
