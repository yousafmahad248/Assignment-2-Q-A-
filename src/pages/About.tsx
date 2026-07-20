import React from "react";
import { Cpu, Info, Mail, Github, Bookmark, Terminal, HelpCircle } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <section className="space-y-2 border-b border-gray-900 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">About & Educational Reference</h1>
        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
          System Overview and Academic Goals
        </p>
      </section>

      {/* Purpose block */}
      <section className="p-6 rounded-xl border border-gray-900 bg-gray-950/40 space-y-4">
        <div className="flex items-center gap-3 text-indigo-400">
          <Bookmark className="w-5 h-5" />
          <h3 className="font-semibold text-gray-200">Laboratory Purpose</h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          The <strong>CPU Scheduling Simulator & Viva Guide</strong> is an advanced, full-stack interactive educational application developed to help computer science students, engineering graduates, and educators master the mathematical mechanics of processor dispatch algorithms.
          Operating systems depend entirely on smart schedulers to alternate CPU execution bursts and I/O wait slots. 
          Through visual Gantt charts, comparing waiting and turnaround time variables in side-by-side charts, taking practice quizzes, and reviewing viva interview decks, students get hands-on validation of operating systems principles.
        </p>
      </section>

      {/* Formulas & Terms Column */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Scheduling Formula Reference Sheet
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-lg border border-gray-900 bg-gray-950/20 space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Basic Calculations</span>
            </h4>
            <div className="space-y-2 text-xs font-mono text-gray-400 leading-relaxed">
              <div className="p-2.5 bg-gray-950 border border-gray-900 rounded">
                <span className="text-emerald-400 font-semibold">Turnaround Time (TAT):</span>
                <p className="text-[11px] mt-0.5">TAT = Completion Time (CT) - Arrival Time (AT)</p>
              </div>
              <div className="p-2.5 bg-gray-950 border border-gray-900 rounded">
                <span className="text-emerald-400 font-semibold">Waiting Time (WT):</span>
                <p className="text-[11px] mt-0.5">WT = Turnaround Time (TAT) - Burst Time (BT)</p>
              </div>
              <div className="p-2.5 bg-gray-950 border border-gray-900 rounded">
                <span className="text-emerald-400 font-semibold">Response Time (RT):</span>
                <p className="text-[11px] mt-0.5">RT = First Scheduled Time (ST) - Arrival Time (AT)</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-gray-900 bg-gray-950/20 space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>System Performance Goals</span>
            </h4>
            <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
              <p>
                <strong className="text-gray-300">Throughput:</strong> The total count of processes completed per unit time. Goal: <span className="text-emerald-400 font-bold">Maximize</span>.
              </p>
              <p>
                <strong className="text-gray-300">CPU Utilization:</strong> Percentage of clock time that the CPU is busy. Goal: <span className="text-emerald-400 font-bold">Maximize</span>.
              </p>
              <p>
                <strong className="text-gray-300">Response & Wait Time:</strong> Waiting durations in queue. Goal: <span className="text-rose-400 font-bold">Minimize</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer block */}
      <section className="p-6 rounded-xl border border-gray-900 bg-gray-950/40 space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Technical Architecture Details
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          The backend API runs on Node.js/Express, writing simulation solvers directly into highly modular, type-safe execution queues. 
          Dynamic visualization is powered by <strong>Vite + React 19</strong> paired with <strong>Tailwind CSS v4</strong> and <strong>Framer Motion (motion)</strong> transitions. 
          Analytical histograms are calculated and rendered dynamically using <strong>Recharts</strong>.
        </p>
      </section>

      {/* Contact Info Footer */}
      <section className="flex flex-col md:flex-row items-center justify-between p-5 border border-gray-900 bg-gray-950 rounded-xl gap-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-gray-500" />
          <span className="text-xs text-gray-500">Have questions about the simulator or want to contribute?</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold no-print">
          <a
            href="mailto:support@os-lab.edu"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email OS Support</span>
          </a>
        </div>
      </section>
    </div>
  );
};
