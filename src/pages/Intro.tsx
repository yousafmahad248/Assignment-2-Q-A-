import React from "react";
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  TrendingUp, 
  Clock, 
  Shuffle, 
  ShieldAlert,
  ArrowRightLeft
} from "lucide-react";

export const Intro: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl">
      {/* Page Header */}
      <section className="space-y-2 border-b border-gray-900 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">CPU Scheduling</h1>
        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
          Theory & Core OS Architectures
        </p>
      </section>

      {/* Introduction Card */}
      <section className="p-6 rounded-xl border border-gray-900 bg-gray-950/40 space-y-4">
        <h2 className="text-base font-semibold text-gray-200">What is CPU Scheduling?</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          CPU Scheduling is a fundamental process in multitasking operating systems. It allows the operating system to dynamically allocate CPU execution time among competing processes. 
          Because a computer's CPU can only execute one instruction stream at a time, and because processes often block waiting for user inputs, networks, or file systems (I/O burst), the scheduler fills these "idle blocks" by loading other ready processes. 
          By maintaining high CPU utilization, scheduling prevents system lag and keeps processes flowing.
        </p>
      </section>

      {/* Objectives Grid */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Primary Objectives of Schedulers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-lg border border-gray-900 bg-gray-950/20 space-y-2">
            <div className="text-indigo-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Maximize Utilization</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Keep the CPU as busy as possible (ideally 100% of the time) so that no system resources go wasted.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-gray-900 bg-gray-950/20 space-y-2">
            <div className="text-emerald-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Minimize Wait Times</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Keep the overall average time a process spends sitting in the Ready Queue waiting for execution to an absolute minimum.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-gray-900 bg-gray-950/20 space-y-2">
            <div className="text-amber-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span>Maximize Throughput</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Complete the highest number of processes possible in a given unit of time to optimize overall speed.
            </p>
          </div>
        </div>
      </section>

      {/* Preemptive vs Non-Preemptive Comparison */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Preemptive vs. Non-Preemptive Scheduling
        </h2>
        
        {/* Visual block comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Non-preemptive */}
          <div className="p-6 rounded-xl border border-gray-900 bg-gray-950/50 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <h3 className="text-sm font-semibold text-gray-200">Non-Preemptive Scheduling</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Once a process gains control of the CPU, it keeps it until it either finishes execution entirely or voluntarily yields to block for Input/Output. The OS cannot forcibly interrupt it.
            </p>
            <div className="pt-2 space-y-2 border-t border-gray-900/50">
              <div className="flex items-start gap-2 text-xs text-emerald-400/90 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Simple to build, low context-switching overhead</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-rose-400/90 font-medium">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>One long process can block the CPU indefinitely (starvation)</span>
              </div>
            </div>
            {/* Diagram */}
            <div className="bg-gray-950 border border-gray-900 p-3 rounded-lg text-center font-mono text-[10px] text-gray-500 space-y-1.5">
              <span>Process Flow Execution (Sequential)</span>
              <div className="flex justify-center items-center gap-1">
                <div className="bg-rose-500/10 border border-rose-500 text-rose-400 px-2 py-1 rounded">Process 1 Starts</div>
                <div className="text-gray-600">→</div>
                <div className="bg-gray-900 border border-gray-800 text-gray-400 px-2 py-1 rounded">Completes</div>
                <div className="text-gray-600">→</div>
                <div className="bg-indigo-500/10 border border-indigo-500 text-indigo-400 px-2 py-1 rounded">Process 2 Runs</div>
              </div>
            </div>
          </div>

          {/* Preemptive */}
          <div className="p-6 rounded-xl border border-gray-900 bg-gray-950/50 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <h3 className="text-sm font-semibold text-gray-200">Preemptive Scheduling</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The OS can interrupt a running process and reallocate the CPU to another task based on priorities, timers, or ready queue updates. This is standard in all modern interactive operating systems.
            </p>
            <div className="pt-2 space-y-2 border-t border-gray-900/50">
              <div className="flex items-start gap-2 text-xs text-emerald-400/90 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Highly responsive, fast turnaround for short tasks</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-rose-400/90 font-medium">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Increased context-switching overhead, requires sync</span>
              </div>
            </div>
            {/* Diagram */}
            <div className="bg-gray-950 border border-gray-900 p-3 rounded-lg text-center font-mono text-[10px] text-gray-500 space-y-1.5">
              <span>Context Preemption (Interrupted)</span>
              <div className="flex justify-center items-center gap-1">
                <div className="bg-indigo-500/10 border border-indigo-500 text-indigo-400 px-1.5 py-1 rounded">P1 Runs</div>
                <div className="text-gray-600">☇</div>
                <div className="bg-amber-500/10 border border-amber-500 text-amber-400 px-1.5 py-1 rounded">P2 Preempts</div>
                <div className="text-gray-600">→</div>
                <div className="bg-indigo-500/10 border border-indigo-500 text-indigo-400 px-1.5 py-1 rounded">P1 Resumes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages & Disadvantages cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-gray-900 bg-gray-950/20 space-y-3">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Advantages of Good Schedulers</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-400 leading-relaxed list-disc list-inside">
            <li>Guarantees fairness and keeps processes from waiting indefinitely.</li>
            <li>Promotes high hardware efficiency by utilizing all CPU idle periods.</li>
            <li>Enables real-time and responsive system behavior for critical tasks.</li>
          </ul>
        </div>
        
        <div className="p-6 rounded-xl border border-gray-900 bg-gray-950/20 space-y-3">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Disadvantages / Constraints</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-400 leading-relaxed list-disc list-inside">
            <li>Adds CPU overhead for checking schedules and swapping register states.</li>
            <li>Prone to 'starvation' bugs where low-priority jobs sit indefinitely.</li>
            <li>Requires complex priority logic and custom hardware interrupts.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
