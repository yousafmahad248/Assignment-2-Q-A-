import React from "react";
import { 
  ArrowRight, 
  Play, 
  HelpCircle, 
  Layers, 
  Cpu, 
  LineChart, 
  MessageSquareCode, 
  CheckCircle2,
  Bookmark
} from "lucide-react";

interface HomeProps {
  setCurrentTab: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentTab }) => {
  const stats = [
    { title: "First-Come, First-Served", value: "FCFS", desc: "Non-preemptive sequential queueing solver." },
    { title: "Shortest Job First", value: "SJF", desc: "Supports Preemptive (SRTF) and Non-preemptive optimal modes." },
    { title: "Priority Scheduling", value: "Priority", desc: "Preemptive / Non-preemptive order-based solver." },
  ];

  const features = [
    {
      title: "Interactive CPU Scheduling",
      desc: "Configure Process ID, Arrival Time, Burst Time, and Priorities. Run real-time solvers (FCFS, SJF, Priority) instantly.",
      icon: Cpu,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Dynamic Gantt Charts",
      desc: "Visualize scheduled context-switches, preemptions, and CPU idle time slices with millisecond-precision animations.",
      icon: Layers,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "MFT / MVT Memory Trackers",
      desc: "Trace partition fragmentation, First-Fit vs. Best-Fit decisions, and compaction algorithms in step-by-step simulations.",
      icon: LineChart,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Coursework Sync & Exam Prep",
      desc: "Prepare for operating systems oral exams and laboratory vivas with our structured Guides for Assignment 2.",
      icon: MessageSquareCode,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-2xl border border-gray-900 overflow-hidden bg-gradient-to-br from-indigo-950/20 via-gray-950 to-gray-950 p-8 lg:p-14 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_50%)]"></div>
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Interactive Laboratory Guide & Simulator</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-sans font-bold tracking-tight text-white leading-none">
            CPU Scheduling & <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Memory Management System
            </span>
          </h1>
          <p className="text-sm lg:text-base text-gray-400 leading-relaxed max-w-xl">
            Learn, visualize, and test your comprehension of Operating System CPU dispatch algorithms and physical memory partitioning strategies (MFT, MVT, Paging, and Compaction).
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentTab("fcfs")}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start CPU Simulation</span>
            </button>
            <button
              onClick={() => setCurrentTab("partb")}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 font-medium text-xs tracking-wider uppercase transition-all"
            >
              <span>Explore Memory Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Algorithms Supported Stats */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Supported Scheduling Paradigms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-gray-900 bg-gray-950/40 backdrop-blur-sm shadow-sm flex flex-col justify-between hover:border-gray-800 transition-colors group"
            >
              <div>
                <span className="text-xl font-bold text-gray-100 font-sans tracking-tight mb-1 block">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-indigo-400 tracking-wide block mb-3">
                  {stat.title}
                </span>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-900/50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span className="group-hover:text-indigo-400 transition-colors">Launch Module</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Platform Capabilities & Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-gray-900 bg-gray-950/20 hover:bg-gray-950/40 transition-colors flex gap-4"
              >
                <div className={`p-3 rounded-lg border shrink-0 w-12 h-12 flex items-center justify-center ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-200">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lab Certification banner */}
      <section className="p-6 rounded-xl border border-gray-900 bg-gray-950/60 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-200">Ready to test your knowledge?</h4>
            <p className="text-xs text-gray-500">
              Complete the quiz modules to test your mastery of OS CPU schedules.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab("quiz")}
          className="px-5 py-2.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 font-semibold text-xs tracking-wider uppercase transition-colors"
        >
          Take Interactive Quiz
        </button>
      </section>
    </div>
  );
};
