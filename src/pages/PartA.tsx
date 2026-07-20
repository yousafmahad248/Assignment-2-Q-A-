import React, { useState } from "react";
import { 
  ShieldAlert, 
  CheckCircle, 
  Play, 
  RefreshCw, 
  Zap, 
  Cpu, 
  Lock, 
  Unlock,
  Layers,
  ArrowRight
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";

interface Question {
  id: string;
  title: string;
  qText: string;
  answer: string;
  category: string;
  importantPoints: string[];
}

export const PartA: React.FC = () => {
  const [activeQ, setActiveQ] = useState<string>("Q1");

  // Questions definitions
  const questions: Question[] = [
    {
      id: "Q1",
      title: "Q1 · Race Condition Data Structures",
      qText: "What are two kernel data structures where race conditions are possible?",
      answer: "1. The kernel's process list (linked list of PCBs)\nThe kernel keeps a linked list of Process Control Blocks (PCBs) to track every process in the system. A race condition can occur if two CPU cores run kernel code that inserts or removes a PCB at the same time — for example, one core is forking a new process while another is reaping a terminated one. Both read the current head/next pointers before either writes back the updated list, so one update can be lost or the list can become corrupted (dangling pointers, a process disappearing from the list, or two processes ending up with the same PCB slot).\n\n2. The kernel memory allocator's free-list / free-frame bitmap\nThe kernel maintains a data structure (a free list or a bitmap) that records which physical memory frames are free. If two threads on different cores both call the allocator concurrently, each may read the structure, see the same frame marked 'free', and both mark it allocated — the classic read-modify-write race. The result is that the same physical frame gets handed out twice, corrupting whichever process writes to it second.",
      category: "Process Synchronization",
      importantPoints: [
        "PCB Linked List insertion/deletion lacks atomicity, leading to dangling pointers.",
        "Free-frame bitmap allocator double-assigns frames if concurrent reads see the same free frame.",
        "Other examples: open-file tables, scheduler ready queues, or shared network packet buffers."
      ]
    },
    {
      id: "Q2",
      title: "Q2 · Spinlock vs. Sleeping Mutex",
      qText: "Compare Spinlocks and Sleeping Mutexes under three distinct operating system scenarios.",
      answer: "1. Lock held for a short duration → Spinlock is better. Putting a thread to sleep and waking it later costs two context switches, which are expensive relative to a short critical section. Spinning wastes a few CPU cycles but avoids that overhead entirely.\n\n2. Lock held for a long duration → Mutex (sleep) is better. If the wait is long, the CPU cycles wasted by spinning far outweigh the one-time cost of two context switches, and letting the waiting thread sleep frees the CPU core to do other useful work.\n\n3. A thread may sleep while holding the lock → Mutex is the only safe choice. A spinlock must never be held across a voluntary sleep: other cores would spin — possibly indefinitely — waiting for a lock that won't be released until the sleeping thread is rescheduled, wasting CPU and risking priority inversion or effective deadlock.",
      category: "Locking Strategies",
      importantPoints: [
        "Short critical sections: Spinlocks bypass context-switch context costs.",
        "Long critical sections: Sleeping Mutexes yield the CPU core to prevent busy-waiting waste.",
        "Never sleep holding a spinlock: Induces massive spinning CPU storms and deadlock risks."
      ]
    },
    {
      id: "Q3",
      title: "Q3 · Spinlock Upper Bound",
      qText: "What is the upper bound for holding a spinlock in terms of context switch overhead time T?",
      answer: "Upper bound ≈ 2T\n\nA spinlock should be held for no longer than about 2T. Putting a waiting thread to sleep and later waking it up requires two context switches — one to switch the waiting thread out, and one to switch it back in when the lock becomes available — each costing time T. So the 'break-even point' is roughly 2T: if the critical section takes less than 2T, spinning wastes less CPU time than the two context switches a sleeping mutex would cost; if it takes longer than 2T, a sleeping mutex becomes the cheaper option.",
      category: "Mathematical Analysis",
      importantPoints: [
        "Context switch overhead T represents saving and restoring CPU registers and memory mapping.",
        "Going to sleep and waking up represents two separate context switches, yielding 2T total cost.",
        "If holding time is less than 2T, busy-waiting is mathematically cheaper than sleeping."
      ]
    },
    {
      id: "Q4",
      title: "Q4 · Mutex vs. atomic_t",
      qText: "For incrementing a simple integer counter 'hits', is a mutex_lock or an atomic_t variable more efficient?",
      answer: "The atomic-integer strategy (atomic_inc(&hits)) is more efficient.\n\natomic_inc is implemented directly with a hardware-supported atomic instruction (e.g. a CPU compare-and-swap or fetch-and-add), executed in a single uninterruptible step with no separate acquire/release calls, no possibility of the calling thread blocking, and no extra lock data structure to maintain.\n\nThe mutex-based version has to acquire a lock object, potentially block (context-switch) if another thread already holds it, then release it — overhead that exists purely to protect a single-word update.\n\nSince hits++ is nothing more than a simple read-modify-write on one integer, it fits exactly the case atomic operations are designed for, so the mutex's extra machinery buys no additional safety, only additional cost.",
      category: "Instruction Efficiency",
      importantPoints: [
        "Atomic operations utilize single hardware assembly instructions (e.g., LOCK XADD).",
        "Mutexes require system calls, queue management, thread suspension, and context switches.",
        "For basic integers and pointers, atomic variables are order-of-magnitude more performant."
      ]
    },
    {
      id: "Q5",
      title: "Q5 · Figure 6.20 Race Fix",
      qText: "Identify the race condition(s) in Figure 6.20 and describe where to place locks and whether atomic_t is sufficient.",
      answer: "a. Identify the race condition(s):\nnumber_of_processes is a shared variable updated with ++ and --, which are not atomic operations — each compiles to a read, a modify, and a write-back. If two processes call these routines concurrently, both can read the same old value before writing back, causing a lost update.\n\nA second, related race exists in the allocation routine: two threads can evaluate check number_of_processes == MAX_PROCESSES as false concurrently, then both allocate, exceeding the MAX_PROCESSES boundary.\n\nb. Where to place the locking:\nAcquire mutex before the check, release it after the increment (or decrement in release):\n\n// allocate\nmutex.acquire();\nif (number_of_processes == MAX_PROCESSES) {\n    mutex.release();\n    return -1;\n}\n++number_of_processes;\nmutex.release();\n\n// release\nmutex.acquire();\n--number_of_processes;\nmutex.release();\n\nc. Would atomic_t number_of_processes be enough?\nOnly partially. Using atomic_t prevents lost updates on ++/--, but does NOT fix the compound 'check-then-act' race. Two threads could still pass the '== MAX_PROCESSES' check before either increments, exceeding MAX_PROCESSES. Mutex is still required to protect the critical check-and-increment sequence.",
      category: "Code Auditing",
      importantPoints: [
        "Counter updates compile to a non-atomic read-modify-write CPU sequence.",
        "Compound 'check-then-act' operations are prone to race conditions even with atomic types.",
        "Mutex locking ensures the state check and state modification occur as one atomic block."
      ]
    }
  ];

  const currentQObj = questions.find(q => q.id === activeQ) || questions[0];

  // ==========================================
  // SIMULATOR STATE & LOGIC FOR EACH QUESTION
  // ==========================================

  // --- Q1 STATES ---
  const [q1Mode, setQ1Mode] = useState<"bitmap" | "pcb">("pcb");
  const [q1Status, setQ1Status] = useState<"idle" | "running_race" | "running_safe">("idle");
  const [q1Data, setQ1Data] = useState<any>({
    nodes: ["Head", "Process 102", "Process 105"],
    bitmap: [1, 1, 0, 0, 1, 0],
    messages: []
  });

  const runQ1Simulation = (withLock: boolean) => {
    setQ1Status(withLock ? "running_safe" : "running_race");
    setQ1Data((prev: any) => ({ ...prev, messages: ["Initializing Core 0 & Core 1 concurrent requests..."] }));

    setTimeout(() => {
      if (q1Mode === "pcb") {
        if (withLock) {
          setQ1Data({
            nodes: ["Head", "Process 102", "Process 105", "Core 0 (Fork-A)", "Core 1 (Fork-B)"],
            bitmap: [1, 1, 0, 0, 1, 0],
            messages: [
              "[Core 0] Acquired Mutex lock.",
              "[Core 1] Mutex busy. Transitioning Core 1 to BLOCKED queue.",
              "[Core 0] Linked 'Process 105' → 'Core 0 (Fork-A)'. Fork-A insertion successful.",
              "[Core 0] Released Mutex lock.",
              "[Core 1] Unblocked from queue. Acquired lock.",
              "[Core 1] Linked 'Core 0 (Fork-A)' → 'Core 1 (Fork-B)'. Fork-B insertion successful.",
              "[Core 1] Released lock.",
              "✅ SUCCESS: Linked list contains all processes without corruption."
            ]
          });
        } else {
          setQ1Data({
            nodes: ["Head", "Process 102", "Orphaned (Fork-B)", "Core 0 (Fork-A)"],
            bitmap: [1, 1, 0, 0, 1, 0],
            messages: [
              "[Core 0] Read current end node 'Process 105'.",
              "[Core 1] Read current end node 'Process 105' (Simultaneous unsynchronized read!)",
              "[Core 0] Wrote 'Process 105' → 'Core 0 (Fork-A)'.",
              "[Core 1] Wrote 'Process 105' → 'Core 1 (Fork-B)' (Overwrote Core 0's link!)",
              "❌ RACE CONDITION CORRUPTION: 'Fork-A' pointer is orphaned/lost in kernel memory!"
            ]
          });
        }
      } else {
        // Bitmap mode
        if (withLock) {
          setQ1Data({
            nodes: ["Head", "Process 102", "Process 105"],
            bitmap: [1, 1, 1, 1, 1, 0], // Assigned index 2 and 3 safely
            messages: [
              "[Core 0] Acquired Allocator Mutex lock.",
              "[Core 0] Scanned bitmap, saw Slot 2 is free. Marking Slot 2 as Allocated.",
              "[Core 0] Released lock. Dispatched physical Frame 2.",
              "[Core 1] Acquired lock. Scanned bitmap, saw Slot 3 is free.",
              "[Core 1] Marking Slot 3 as Allocated. Released lock. Dispatched Frame 3.",
              "✅ SUCCESS: Core 0 gets Frame 2, Core 1 gets Frame 3 safely."
            ]
          });
        } else {
          setQ1Data({
            nodes: ["Head", "Process 102", "Process 105"],
            bitmap: [1, 1, 1, 0, 1, 0], // Both mark Slot 2
            messages: [
              "[Core 0] Scanned bitmap. Saw Slot 2 is free.",
              "[Core 1] Scanned bitmap. Saw Slot 2 is free. (Simultaneous unsynchronized read!)",
              "[Core 0] Marking Slot 2 as Allocated. Dispatched Frame 2.",
              "[Core 1] Marking Slot 2 as Allocated. Dispatched Frame 2.",
              "❌ RACE CONDITION CORRUPTION: Frame 2 double-allocated to two different processes! Data corruption guaranteed!"
            ]
          });
        }
      }
      setQ1Status("idle");
    }, 1500);
  };

  // --- Q2 STATES ---
  const [csDuration, setCsDuration] = useState<number>(120); // cycle units (T=100)
  const [q2LockType, setQ2LockType] = useState<"spinlock" | "mutex">("spinlock");
  const [q2Status, setQ2Status] = useState<"idle" | "running">("idle");
  const [q2Log, setQ2Log] = useState<string[]>([]);
  const [q2Metrics, setQ2Metrics] = useState({ cpuWasted: 0, csCost: 0, status: "" });

  const runQ2Simulation = () => {
    setQ2Status("running");
    setQ2Log(["Thread A holds the lock.", "Thread B requests lock and must wait."]);
    
    setTimeout(() => {
      const T = 100; // Switch overhead
      if (q2LockType === "spinlock") {
        const waste = csDuration; // active spinning
        setQ2Log([
          "Thread A holds lock.",
          "Thread B active-spins (busy-waits) in CPU loop.",
          `[Spinning] Wasting active clock cycles continuously...`,
          "Thread A releases lock.",
          "Thread B immediately grabs lock without context switch."
        ]);
        setQ2Metrics({
          cpuWasted: waste,
          csCost: 0,
          status: csDuration < 2 * T ? "Optimal Choice" : "Inefficient (Spinning waste is too high)"
        });
      } else {
        // Mutex
        setQ2Log([
          "Thread A holds lock.",
          "Thread B requests lock. Lock busy.",
          `[Context Switch] Thread B goes to sleep (overhead T = ${T} cycles).`,
          "Thread A releases lock.",
          "OS triggers wake up.",
          `[Context Switch] Thread B restored to CPU (overhead T = ${T} cycles).`
        ]);
        setQ2Metrics({
          cpuWasted: 0,
          csCost: 2 * T,
          status: csDuration >= 2 * T ? "Optimal Choice" : "Inefficient (Context switch costs exceed spinning duration)"
        });
      }
      setQ2Status("idle");
    }, 1200);
  };

  // --- Q3 CHART DATA ---
  const tTime = 100;
  const q3ChartData = Array.from({ length: 41 }, (_, i) => {
    const csVal = i * 10; // 0 to 400
    return {
      name: `${(csVal / tTime).toFixed(1)}T`,
      duration: csVal,
      spinlockCost: csVal, // Spinlock CPU cycles spent is CS duration
      mutexCost: 2 * tTime, // Mutex always costs exactly 2T context switches
    };
  });

  // --- Q4 STATES ---
  const [q4Status, setQ4Status] = useState<"idle" | "running_mutex" | "running_atomic">("idle");
  const [q4Hits, setQ4Hits] = useState<number>(0);
  const [q4Overhead, setQ4Overhead] = useState({ time: 0, switches: 0 });

  const runQ4Simulation = (mode: "mutex" | "atomic") => {
    setQ4Status(mode === "mutex" ? "running_mutex" : "running_atomic");
    setQ4Hits(0);
    setQ4Overhead({ time: 0, switches: 0 });

    let count = 0;
    const target = 1000;
    const interval = setInterval(() => {
      count += 100;
      setQ4Hits(count);
      if (mode === "mutex") {
        setQ4Overhead(prev => ({
          time: Math.round(count * 0.95),
          switches: Math.round(count * 1.6)
        }));
      } else {
        setQ4Overhead(prev => ({
          time: Math.round(count * 0.04),
          switches: 0
        }));
      }

      if (count >= target) {
        clearInterval(interval);
        setQ4Status("idle");
      }
    }, 100);
  };

  // --- Q5 STATES ---
  const [q5Lock, setQ5Lock] = useState<boolean>(false);
  const [q5Processes, setQ5Processes] = useState<number>(3); // Initial 3
  const [q5Status, setQ5Status] = useState<"idle" | "simulating">("idle");
  const [q5Log, setQ5Log] = useState<string[]>([]);

  const runQ5Simulation = () => {
    setQ5Status("simulating");
    setQ5Log(["Initializing allocator concurrent execution..."]);

    setTimeout(() => {
      if (!q5Lock) {
        // Race mode
        setQ5Log([
          "[Thread A] Check number_of_processes == MAX_PROCESSES (3 == 4 is False). Safe to proceed.",
          "[Thread B] Check number_of_processes == MAX_PROCESSES (3 == 4 is False). (Simultaneous unsynchronized check!)",
          "[Thread A] Allocated resources. ++number_of_processes.",
          "[Thread B] Allocated resources. ++number_of_processes.",
          `⚠️ VIOLATION: Process count reached ${q5Processes + 2} (exceeded MAX_PROCESSES = 4)!`
        ]);
        setQ5Processes(5);
      } else {
        // Locked mode
        setQ5Log([
          "[Thread A] Acquired Mutex lock.",
          "[Thread B] Mutex busy. Waiting in queue...",
          "[Thread A] Check number_of_processes == MAX_PROCESSES (3 == 4 is False). Safe.",
          "[Thread A] ++number_of_processes (now 4). Released Mutex lock.",
          "[Thread B] Unblocked. Acquired Mutex lock.",
          "[Thread B] Check number_of_processes == MAX_PROCESSES (4 == 4 is True). BLOCKED!",
          "[Thread B] Releasing lock and returning error code -1.",
          "✅ SUCCESS: System safely bounded process creation within MAX_PROCESSES = 4."
        ]);
        setQ5Processes(4);
      }
      setQ5Status("idle");
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-900 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Part A · Process Synchronization</h2>
        <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">
          Race Conditions, Spinlocks vs. Sleeping Mutexes, and Atomicity Audit (Q1 - Q5)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Sidebar list of Q1-Q5 */}
        <div className="lg:col-span-4 space-y-2.5">
          {questions.map(q => (
            <button
              key={q.id}
              onClick={() => setActiveQ(q.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                activeQ === q.id 
                  ? "bg-indigo-600/15 border-indigo-500/30 text-white shadow-md shadow-indigo-950/20"
                  : "bg-gray-950/40 border-gray-900 text-gray-400 hover:border-gray-800 hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono font-bold text-[10px] text-indigo-400 uppercase tracking-widest">
                  {q.category}
                </span>
                {activeQ === q.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </div>
              <h3 className="font-bold text-gray-100 font-sans tracking-tight line-clamp-1">{q.title}</h3>
              <p className="text-[10.5px] text-gray-500 line-clamp-2 leading-relaxed">{q.qText}</p>
            </button>
          ))}
        </div>

        {/* Right column: Split Question details & concept sandbox */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Question Display card */}
          <div className="p-6 rounded-2xl border border-gray-900 bg-gray-950/50 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Question under Defense
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">{currentQObj.qText}</h3>
            </div>
            
            {/* Answer body */}
            <div className="space-y-4 pt-4 border-t border-gray-900">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Viva-Ready Answer
              </span>
              <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line font-sans">
                {currentQObj.answer}
              </p>
            </div>

            {/* Defense points */}
            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-900 space-y-2">
              <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                Key Defense Talking Points:
              </h4>
              <ul className="space-y-1 text-[11px] text-gray-400">
                {currentQObj.importantPoints.map((pt, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Sandbox for Active Question */}
          <div className="p-6 rounded-2xl border border-indigo-950/40 bg-gray-950/40 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-gray-100 tracking-tight">Interactive Concept Sandbox</h4>
              </div>
              <span className="text-[9px] font-mono text-gray-500 uppercase">Live OS Core Simulator</span>
            </div>

            {/* Q1 SANDBOX */}
            {activeQ === "Q1" && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 border-b border-gray-900 pb-3">
                  <span className="text-xs text-gray-400 font-semibold">Select Data Structure:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setQ1Mode("pcb"); setQ1Data({ nodes: ["Head", "Process 102", "Process 105"], bitmap: [1,1,0,0,1,0], messages: [] }); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        q1Mode === "pcb" 
                          ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
                          : "bg-gray-900/30 border-gray-800 text-gray-500"
                      }`}
                    >
                      Process List (PCB List)
                    </button>
                    <button
                      onClick={() => { setQ1Mode("bitmap"); setQ1Data({ nodes: ["Head", "Process 102", "Process 105"], bitmap: [1,1,0,0,1,0], messages: [] }); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        q1Mode === "bitmap" 
                          ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
                          : "bg-gray-900/30 border-gray-800 text-gray-500"
                      }`}
                    >
                      Free-Frame Bitmap Allocator
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visualizer */}
                  <div className="p-4 rounded-xl bg-gray-950 border border-gray-900 space-y-4">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                      Physical Representation
                    </span>

                    {q1Mode === "pcb" ? (
                      <div className="flex flex-wrap items-center gap-2 py-4">
                        {q1Data.nodes.map((node: string, i: number) => (
                          <React.Fragment key={i}>
                            {i > 0 && <span className="text-gray-700 font-mono">→</span>}
                            <div className={`p-2.5 rounded-lg border text-[10px] font-mono font-medium tracking-tight ${
                              node.includes("Head") ? "bg-gray-900 border-gray-800 text-gray-400" :
                              node.includes("Orphaned") ? "bg-red-950/30 border-red-900/50 text-red-400 animate-pulse" :
                              node.includes("Core 0") ? "bg-indigo-505/10 border-indigo-500/20 text-indigo-400" :
                              node.includes("Core 1") ? "bg-emerald-505/10 border-emerald-500/20 text-emerald-400" :
                              "bg-gray-900/40 border-gray-900 text-gray-300"
                            }`}>
                              {node}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3 py-2">
                        <div className="flex gap-1.5">
                          {q1Data.bitmap.map((bit: number, index: number) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <span className="text-[9px] text-gray-600 font-mono mb-1">F{index}</span>
                              <div className={`w-full py-2.5 rounded-md text-xs font-mono font-bold text-center border ${
                                bit === 1 ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-gray-950 border-gray-900 text-gray-600"
                              }`}>
                                {bit}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-4 text-[10px] font-mono text-gray-500 justify-center">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500/40 border border-indigo-500/20 block" /> Allocated</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gray-950 border border-gray-900 block" /> Free</span>
                        </div>
                      </div>
                    )}

                    {/* Simulation Triggers */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => runQ1Simulation(false)}
                        disabled={q1Status !== "idle"}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-red-900 hover:bg-red-950/20 text-red-400 text-xs font-bold transition-all"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Simulate Race</span>
                      </button>
                      <button
                        onClick={() => runQ1Simulation(true)}
                        disabled={q1Status !== "idle"}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-emerald-900 hover:bg-emerald-950/20 text-emerald-400 text-xs font-bold transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Simulate Safe</span>
                      </button>
                    </div>
                  </div>

                  {/* Terminal Logs */}
                  <div className="p-4 rounded-xl bg-gray-950 border border-gray-900 flex flex-col justify-between min-h-[160px]">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-widest">
                        Core execution log
                      </span>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        {q1Data.messages.length === 0 ? (
                          <p className="text-[11px] text-gray-600 font-mono italic">Click one of the simulation triggers to watch core operations run...</p>
                        ) : (
                          q1Data.messages.map((msg: string, i: number) => (
                            <p key={i} className={`text-[10.5px] font-mono leading-relaxed ${
                              msg.includes("❌") || msg.includes("RACE") ? "text-red-400 font-bold" :
                              msg.includes("✅") || msg.includes("SUCCESS") ? "text-emerald-400 font-bold" :
                              msg.includes("Blocked") || msg.includes("WAITING") ? "text-amber-400" :
                              "text-gray-400"
                            }`}>
                              {msg}
                            </p>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Q2 SANDBOX */}
            {activeQ === "Q2" && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-300">Lock Hold Duration (Critical Section time):</span>
                    <p className="text-[10px] text-gray-500">Break-even threshold is 2T (T = 100 cycles, 2T = 200 cycles)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max="400"
                      value={csDuration}
                      onChange={(e) => setCsDuration(Number(e.target.value))}
                      className="w-36 accent-indigo-500"
                    />
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                      {csDuration} cycles
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column Controls */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 space-y-4">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                      Lock Configuration
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setQ2LockType("spinlock")}
                        className={`py-2 rounded-lg border text-xs font-medium transition-colors ${
                          q2LockType === "spinlock"
                            ? "bg-indigo-600/15 border-indigo-500/30 text-white"
                            : "bg-gray-900/40 border-gray-900 text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Spinlock (Busy Wait)
                      </button>
                      <button
                        onClick={() => setQ2LockType("mutex")}
                        className={`py-2 rounded-lg border text-xs font-medium transition-colors ${
                          q2LockType === "mutex"
                            ? "bg-indigo-600/15 border-indigo-500/30 text-white"
                            : "bg-gray-900/40 border-gray-900 text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Sleeping Mutex
                      </button>
                    </div>

                    <button
                      onClick={runQ2Simulation}
                      disabled={q2Status === "running"}
                      className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20"
                    >
                      {q2Status === "running" ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      <span>Launch Lock Simulation</span>
                    </button>
                  </div>

                  {/* Live Simulation Results */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 space-y-3">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                      Mathematical Costs
                    </span>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono border-b border-gray-900 pb-2">
                        <span className="text-gray-400">Lock Type:</span>
                        <span className="font-bold text-white uppercase">{q2LockType}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono border-b border-gray-900 pb-2">
                        <span className="text-gray-400">Context Switch Cost (2T):</span>
                        <span className="font-bold text-indigo-400">{q2LockType === "mutex" ? "200 cycles" : "0 cycles"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono border-b border-gray-900 pb-2">
                        <span className="text-gray-400">Active CPU Waste:</span>
                        <span className={`font-bold ${q2Metrics.cpuWasted > 0 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                          {q2Metrics.cpuWasted} cycles
                        </span>
                      </div>
                      {q2Metrics.status && (
                        <div className={`p-2.5 rounded border text-[11px] font-medium text-center font-mono ${
                          q2Metrics.status.includes("Optimal")
                            ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                            : "bg-red-950/20 border-red-900/40 text-red-400"
                        }`}>
                          {q2Metrics.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Micro console log */}
                {q2Log.length > 0 && (
                  <div className="p-3 rounded-lg border border-gray-900 bg-gray-950 font-mono text-[10.5px] text-gray-500 space-y-1">
                    {q2Log.map((log, i) => (
                      <p key={i} className={log.includes("Wasting") ? "text-red-400/90 font-bold" : log.includes("Context") ? "text-amber-400/90" : "text-gray-400"}>
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Q3 SANDBOX */}
            {activeQ === "Q3" && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 text-xs leading-relaxed text-gray-400">
                  <p>
                    The line graph below displays the comparative efficiency curve of <strong className="text-white">Spinlocks</strong> vs. <strong className="text-white">Sleeping Mutexes</strong>.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
                    <li><strong className="text-indigo-400">Spinlock Cost (indigo line):</strong> Rises linearly because CPU spends more time spinning the longer the lock is held.</li>
                    <li><strong className="text-pink-400 font-mono">Sleeping Mutex Cost (pink line):</strong> Stays flat at exactly <strong className="text-pink-300 font-bold">2T</strong> (the cost of two context switches) regardless of duration.</li>
                    <li>The lines cross at <strong className="text-white font-bold">2.0T</strong>. This is the optimal upper bound threshold.</li>
                  </ul>
                </div>

                {/* Graph component */}
                <div className="h-[240px] w-full bg-gray-950 p-2 rounded-xl border border-gray-900">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={q3ChartData} margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                      <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 9 }} />
                      <YAxis stroke="#555" tick={{ fontSize: 9 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#09090b", borderColor: "#1f2937", fontSize: "10.5px" }}
                        labelStyle={{ color: "#9ca3af" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                      <Line 
                        type="monotone" 
                        dataKey="spinlockCost" 
                        stroke="#6366f1" 
                        name="Spinlock Overhead (Spin Cycles)" 
                        strokeWidth={2} 
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mutexCost" 
                        stroke="#ec4899" 
                        name="Mutex Overhead (2T Switch Cost)" 
                        strokeWidth={2} 
                        dot={false}
                      />
                      <ReferenceLine x="2.0T" stroke="#eab308" strokeDasharray="4 4" label={{ value: "Break-even (2T)", position: "top", fill: "#eab308", fontSize: "10px" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Q4 SANDBOX */}
            {activeQ === "Q4" && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 text-xs text-gray-400 leading-relaxed">
                  Compare <strong>Software-Locked Mutex</strong> vs <strong>Hardware-Level atomic_t Instructions</strong> in a high-contention multi-threaded increment of <code className="text-white bg-gray-900 px-1 rounded">hits++</code> to 1,000.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Controller */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 space-y-4 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                      Select Hardware Strategy
                    </span>
                    <div className="space-y-2">
                      <button
                        onClick={() => runQ4Simulation("mutex")}
                        disabled={q4Status !== "idle"}
                        className="w-full py-3 rounded-lg border border-indigo-900 hover:bg-indigo-950/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        {q4Status === "running_mutex" ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <Lock className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>Run Mutex Locked hits++</span>
                      </button>
                      <button
                        onClick={() => runQ4Simulation("atomic")}
                        disabled={q4Status !== "idle"}
                        className="w-full py-3 rounded-lg border border-emerald-900 hover:bg-emerald-950/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        {q4Status === "running_atomic" ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>Run atomic_inc(&hits)</span>
                      </button>
                    </div>
                  </div>

                  {/* Overhead Meter */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 space-y-4">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                      System Overhead Metrics
                    </span>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-gray-900 pb-1.5">
                        <span className="text-gray-400">Total Increment Count:</span>
                        <span className="font-bold text-white">{q4Hits} / 1000</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-900 pb-1.5">
                        <span className="text-gray-400">Context Switches triggered:</span>
                        <span className={`font-bold ${q4Overhead.switches > 0 ? "text-red-400" : "text-emerald-400"}`}>
                          {q4Overhead.switches}
                        </span>
                      </div>
                      <div className="flex justify-between pb-1.5">
                        <span className="text-gray-400">CPU Time Spent (approx):</span>
                        <span className={`font-bold ${q4Overhead.time > 100 ? "text-red-400" : "text-emerald-400"}`}>
                          {q4Overhead.time} ms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Q5 SANDBOX */}
            {activeQ === "Q5" && (
              <div className="space-y-5">
                {/* Code audit side-by-side with simulator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Code blocks */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-gray-900 pb-1.5">
                      <span className="text-gray-500 uppercase font-bold text-[9px]">Syllabus C Code</span>
                      <span className="text-gray-600">Figure 6.20</span>
                    </div>
                    <pre className="text-gray-400 leading-normal select-none">
{`// Shared Int State
int number_of_processes = 3; 
#define MAX_PROCESSES 4

// Unsynchronized allocation
if (number_of_processes == MAX_PROCESSES)
    return -1;
else {
    ++number_of_processes; // Non-atomic!
}`}
                    </pre>
                  </div>

                  {/* Console simulator */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-gray-300">Synchronized (Mutex-locked):</span>
                        <button
                          onClick={() => setQ5Lock(!q5Lock)}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase border transition-colors ${
                            q5Lock 
                              ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-400" 
                              : "bg-red-600/10 border-red-500/30 text-red-400"
                          }`}
                        >
                          {q5Lock ? "Mutex Enabled" : "Mutex Disabled"}
                        </button>
                      </div>

                      <div className="space-y-1.5 border-t border-gray-900 pt-3">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-500">number_of_processes:</span>
                          <span className={`font-bold ${q5Processes > 4 ? "text-red-400 animate-pulse" : "text-white"}`}>{q5Processes}</span>
                        </div>
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-500">MAX_PROCESSES:</span>
                          <span className="font-bold text-gray-400">4</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={runQ5Simulation}
                        disabled={q5Status === "simulating"}
                        className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                      >
                        Run Concurrent Allocations
                      </button>
                    </div>
                  </div>
                </div>

                {/* Console logs output */}
                {q5Log.length > 0 && (
                  <div className="p-3 rounded-lg border border-gray-900 bg-gray-950 font-mono text-[10px] space-y-1">
                    {q5Log.map((log, i) => (
                      <p key={i} className={
                        log.includes("⚠️") || log.includes("VIOLATION") ? "text-red-400 font-bold" :
                        log.includes("✅") || log.includes("SUCCESS") ? "text-emerald-400 font-bold" :
                        "text-gray-400"
                      }>
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
