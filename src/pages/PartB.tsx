import React, { useState } from "react";
import { 
  ArrowRight, 
  Layers, 
  Cpu, 
  HelpCircle, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  FolderOpen
} from "lucide-react";

interface Question {
  id: string;
  title: string;
  qText: string;
  answer: string;
  category: string;
  importantPoints: string[];
}

export const PartB: React.FC = () => {
  const [activeQ, setActiveQ] = useState<string>("Q6");

  // Questions definitions
  const questions: Question[] = [
    {
      id: "Q6",
      title: "Q6 · MFT First-Fit Trace",
      qText: "For MFT with 1000 KB and four fixed partitions, trace first-fit allocation for J1=250, J2=90, J3=350, J4=120, J5=180 KB.",
      answer: "Partitions (fixed order): P1 = 100 KB, P2 = 200 KB, P3 = 300 KB, P4 = 400 KB.\n\na. Allocation trace:\n- J1 (250 KB) checks P1(100)✗ → P2(200)✗ → P3(300)✓. Assigned to P3.\n- J2 (90 KB) checks P1(100)✓. Assigned to P1.\n- J3 (350 KB) checks P1 busy → P2(200)✗ → P3 busy → P4(400)✓. Assigned to P4.\n- J4 (120 KB) checks P1 busy → P2(200)✓. Assigned to P2.\n- J5 (180 KB) checks P1 busy, P2 busy, P3 busy, P4 busy. Waits in queue.\n\nb. Internal fragmentation:\n- J1 in P3 (300 KB): 300 - 250 = 50 KB\n- J2 in P1 (100 KB): 100 - 90 = 10 KB\n- J3 in P4 (400 KB): 400 - 350 = 50 KB\n- J4 in P2 (200 KB): 200 - 120 = 80 KB\nTotal internal fragmentation = 190 KB.\n\nc. The job that can never be placed:\nEvery individual job is smaller than the largest partition (P4 = 400 KB), so no job is too big to physically fit. The problem is structural: MFT fixes the number of partitions (here, 4) so at most 4 jobs can ever be resident at once. Once J1–J4 occupy P3, P1, P4 and P2 respectively, all four partitions are permanently full, so J5 (180 KB) is left waiting forever even though it would easily fit inside P2, P3, or P4 if any became free.\n\nWhat allows J5 to run: either increase the number of fixed partitions so the degree of multiprogramming can reach 5, or, more fundamentally, abandon fixed partitioning altogether and use variable partitioning (MVT), which sizes each partition exactly to the job and frees it when the job finishes.",
      category: "Fixed Partitioning (MFT)",
      importantPoints: [
        "First-fit checks partitions in chronological address order (P1 to P4).",
        "Internal fragmentation is the allocated partition space that remains unused by the job.",
        "MFT locks multiprogramming to a fixed count, blocking eligible queue items even if space exists."
      ]
    },
    {
      id: "Q7",
      title: "Q7 · MVT Allocation Trace",
      qText: "Trace MVT first-fit for 640 KB memory with requests and releases. Detail external fragmentation and compaction.",
      answer: "a. Memory state after each event:\n- 0. Initial: [ Hole 640 ]\n- 1. P1 requests 250 KB: [ P1:250 ][ Hole 390 ]\n- 2. P2 requests 150 KB: [ P1:250 ][ P2:150 ][ Hole 240 ]\n- 3. P3 requests 100 KB: [ P1:250 ][ P2:150 ][ P3:100 ][ Hole 140 ]\n- 4. P1 completes (releases 250): [ Hole 250 ][ P2:150 ][ P3:100 ][ Hole 140 ]\n- 5. P4 requests 200 KB (fits in the 250 hole): [ P4:200 ][ Hole 50 ][ P2:150 ][ P3:100 ][ Hole 140 ]\n- 6. P2 completes (merges with adjoining 50 hole): [ P4:200 ][ Hole 200 ][ P3:100 ][ Hole 140 ]\n\nb. Holes and external fragmentation after the last event:\nFinal layout: [ P4:200 ][ Hole 200 ][ P3:100 ][ Hole 140 ]. There are 2 separate holes (200 KB and 140 KB), giving a total external fragmentation of 200 + 140 = 340 KB.\n\nA pending 300 KB request could NOT be satisfied, even though 340 KB of free memory exists in total — no single hole is large enough (the largest is only 200 KB). This is exactly what external fragmentation means: free space exists but isn't contiguous.\n\nc. Compaction:\nTo merge all free space into one hole, the allocated blocks must be pushed together. P4 (200 KB) is already at the start of memory, so it doesn't need to move. Only P3 (100 KB) needs to shift left to close the 200 KB gap, giving [ P4:200 ][ P3:100 ][ Hole 340 ].\nMinimum data moved = 100 KB.\n\nMain operational drawback of compaction: it is expensive and disruptive — the CPU must spend time copying every byte of every process that is relocated, the relocated processes typically have to be paused/suspended while their memory moves, and every relocation register / base pointer must be updated afterward. This overhead can noticeably steal CPU time away from real work and is especially unattractive on systems with real-time or low-latency requirements.",
      category: "Variable Partitioning (MVT)",
      importantPoints: [
        "Dynamic partitioning creates fragmentation as processes allocate and release sizes dynamically.",
        "External fragmentation occurs when total free space exists but is not contiguous.",
        "Compaction merges holes but induces process suspension and memory copy CPU cycles."
      ]
    },
    {
      id: "Q8",
      title: "Q8 · MFT vs. MVT Workload",
      qText: "Compare MFT (five equal 160 KB partitions) and MVT (best-fit) on an 800 KB server with jobs 120, 350, 90, 200, 400, 60 KB in arrival order.",
      answer: "a. MFT — five equal fixed partitions of 160 KB each:\n- 120 KB: Fits (Partition 1)\n- 350 KB: No — larger than any partition (exceeds 160 KB). Blocked.\n- 90 KB: Fits (Partition 2)\n- 200 KB: No — larger than any partition. Blocked.\n- 400 KB: No — larger than any partition. Blocked.\n- 60 KB: Fits (Partition 3)\nOnly the 120, 90 and 60 KB jobs can ever be loaded. Maximum degree of multiprogramming = 3. The 350, 200 and 400 KB jobs can never be loaded, no matter how long they wait, because each exceeds the fixed 160 KB partition size.\n\nb. MVT — best-fit, no compaction:\n- 120 KB: Allocated from 800 KB (only hole) -> [ 120 KB Job ][ Hole 680 KB ]\n- 350 KB: Allocated from 680 KB -> [ 120 KB Job ][ 350 KB Job ][ Hole 330 KB ]\n- 90 KB: Allocated from 330 KB -> [ 120 KB Job ][ 350 KB Job ][ 90 KB Job ][ Hole 240 KB ]\n- 200 KB: Allocated from 240 KB -> [ 120 KB Job ][ 350 KB Job ][ 90 KB Job ][ 200 KB Job ][ Hole 40 KB ]\n- 400 KB: 40 KB — too small. Rejected / must wait.\n- 60 KB: 40 KB — too small. Rejected / must wait.\n4 jobs (120, 350, 90, 200 KB) can be resident at the same time.\nMemory utilization = 760 / 800 = 95%.\n\nc. Trade-off between MFT and MVT for this workload:\n- Degree of multiprogramming: MFT tops out at 3 resident jobs (fixed 160 KB partitions permanently exclude anything larger), while MVT achieves 4 resident jobs because each partition is sized exactly to the job requesting it.\n- Memory utilization: MVT reaches 95% here versus MFT, which wastes memory to internal fragmentation inside every partition and additionally leaves entire jobs unable to run at all.\n- Operating-system overhead: MFT is simple and predictable — fixed partitions, quick lookup, no external fragmentation. MVT needs more bookkeeping (dynamic free-list, best-fit search) and is exposed to external fragmentation, which can eventually require costly compaction.",
      category: "Comparison Study",
      importantPoints: [
        "MFT locks out jobs larger than partition boundaries, even if total free space is huge.",
        "MVT custom-sizes partitions to achieve optimal utilization (95% in this workload).",
        "MFT is simple with low overhead; MVT requires advanced bookkeeping and suffers external fragmentation."
      ]
    },
    {
      id: "Q9",
      title: "Q9 · Best-Fit vs. Worst-Fit",
      qText: "Simulate Best-fit and Worst-fit for holes: H1=20, H2=15, H3=18, H4=8, H5=6 KB with requests R1=12, R2=10, R3=9, R4=15 KB. Contrast their behavior.",
      answer: "a. Best-fit (smallest hole that still fits):\n- R1 = 12: Chosen hole H2 (15) -> Leftover holes (H1...H5): 20, 3, 18, 8, 6\n- R2 = 10: Chosen hole H3 (18) -> Leftover holes: 20, 3, 8, 8, 6\n- R3 = 9: Chosen hole H1 (20) -> Leftover holes: 11, 3, 8, 8, 6\n- R4 = 15: none ≥ 15 — cannot be satisfied. Blocked.\n\nb. Worst-fit (largest hole every time):\n- R1 = 12: Chosen hole H1 = 20 -> Leftover holes (H1...H5): 8, 15, 18, 8, 6\n- R2 = 10: Chosen hole H3 = 18 -> Leftover holes: 8, 15, 8, 8, 6\n- R3 = 9: Chosen hole H2 = 15 -> Leftover holes: 8, 6, 8, 8, 6\n- R4 = 15: none ≥ 15 — cannot be satisfied. Blocked.\n\nc. External fragmentation and unsatisfied requests:\nBoth strategies leave exactly 36 KB free in total, yet neither can satisfy R4 (15 KB) — no single leftover hole reaches 15 KB in either case, a direct illustration of external fragmentation.\n\nd. When worst-fit can outperform best-fit long-term:\nBest-fit's habit of choosing the tightest hole at every step tends to leave many tiny, unusable slivers behind (here, a useless 3 KB fragment). Worst-fit instead always carves from the largest hole, tending to leave one larger leftover hole rather than several small unusable ones. If future requests are moderate in size, that larger hole is more likely to still be usable — so worst-fit can beat best-fit over many allocations, despite looking worse at each individual step.",
      category: "Allocation Strategies",
      importantPoints: [
        "Best-fit optimizes immediate fit but leaves tiny, unusable 'shattered' fragments of free space.",
        "Worst-fit always consumes largest hole, keeping leftover spaces large and usable for future allocations.",
        "Both strategies are prone to blocking when requests exceed the largest isolated hole."
      ]
    },
    {
      id: "Q10",
      title: "Q10 · Fragmentation Puzzle",
      qText: "Explain why MVT can reject processes despite 35% free memory. Contrast Compaction vs Paging solutions.",
      answer: "a. The phenomenon:\nThis is external fragmentation. Under MVT, free memory becomes scattered across many small, non-adjacent holes rather than existing as one contiguous block. A high percentage of free memory says nothing about how that free memory is distributed — it could be one large usable hole, or dozens of small holes none of which is individually big enough for the incoming request.\n\nb. Two distinct solutions:\n1. Stay contiguous → Compaction: periodically shift all allocated processes together (requires relocatable code) so every free hole merges into one large contiguous block.\n2. Go non-contiguous → Paging: divide physical memory into fixed-size frames and let a process's pages scatter across any available frames. This removes external fragmentation almost entirely, leaving at most internal fragmentation on the last partial page.\n\nc. Operational cost of the compaction solution:\nCompaction costs real CPU time proportional to the amount of memory moved, requires pausing affected processes during their move, and needs every relocation register updated afterward. This becomes unacceptable under high memory churn (frequent process creation/termination), very large memory sizes or large-footprint processes, and real-time or latency-sensitive systems where pausing for compaction can violate timing guarantees.",
      category: "System Architectures",
      importantPoints: [
        "Contiguous physical allocation is structurally limited by external fragmentation.",
        "Compaction forces contiguity but requires massive CPU data copy blocks and freezes processes.",
        "Paging completely solves external fragmentation by allowing non-contiguous allocation."
      ]
    }
  ];

  const currentQObj = questions.find(q => q.id === activeQ) || questions[0];

  // ==========================================
  // SIMULATOR STATE & LOGIC FOR EACH QUESTION
  // ==========================================

  // --- Q6 STATE ---
  const [q6Step, setQ6Step] = useState<number>(0);
  const q6PartitionsInit = [
    { name: "P1", size: 100, occupied: false, job: "", jobSize: 0 },
    { name: "P2", size: 200, occupied: false, job: "", jobSize: 0 },
    { name: "P3", size: 300, occupied: false, job: "", jobSize: 0 },
    { name: "P4", size: 400, occupied: false, job: "", jobSize: 0 }
  ];
  const [q6Partitions, setQ6Partitions] = useState(q6PartitionsInit);
  const q6Jobs = [
    { name: "J1", size: 250 },
    { name: "J2", size: 90 },
    { name: "J3", size: 350 },
    { name: "J4", size: 120 },
    { name: "J5", size: 180 }
  ];
  const [q6Log, setQ6Log] = useState<string[]>([]);

  const handleQ6Step = () => {
    if (q6Step >= q6Jobs.length) return;
    const currentJob = q6Jobs[q6Step];
    const updated = [...q6Partitions];
    let allocated = false;
    let logMsg = "";

    // Scan partitions in first-fit order
    for (let i = 0; i < updated.length; i++) {
      if (!updated[i].occupied && updated[i].size >= currentJob.size) {
        updated[i].occupied = true;
        updated[i].job = currentJob.name;
        updated[i].jobSize = currentJob.size;
        allocated = true;
        logMsg = `✅ Job ${currentJob.name} (${currentJob.size} KB) fits in ${updated[i].name} (${updated[i].size} KB). Internal Fragmentation = ${updated[i].size - currentJob.size} KB.`;
        break;
      }
    }

    if (!allocated) {
      logMsg = `❌ Job ${currentJob.name} (${currentJob.size} KB) could NOT find any available partition that fits it. Sits in queue.`;
    }

    setQ6Partitions(updated);
    setQ6Log(prev => [...prev, logMsg]);
    setQ6Step(prev => prev + 1);
  };

  const resetQ6 = () => {
    setQ6Step(0);
    setQ6Partitions(q6PartitionsInit);
    setQ6Log([]);
  };

  // --- Q7 STATE ---
  const [q7Step, setQ7Step] = useState<number>(0);
  const [q7Log, setQ7Log] = useState<string[]>([]);
  const [q7Compacted, setQ7Compacted] = useState<boolean>(false);
  const [q7Allocated300, setQ7Allocated300] = useState<boolean>(false);

  // Events list representing exact timeline
  const q7Events = [
    { title: "Initial State", layout: [{ type: "hole", size: 640, label: "Hole" }] },
    { title: "P1 requests 250 KB", layout: [{ type: "process", size: 250, label: "P1" }, { type: "hole", size: 390, label: "Hole" }] },
    { title: "P2 requests 150 KB", layout: [{ type: "process", size: 250, label: "P1" }, { type: "process", size: 150, label: "P2" }, { type: "hole", size: 240, label: "Hole" }] },
    { title: "P3 requests 100 KB", layout: [{ type: "process", size: 250, label: "P1" }, { type: "process", size: 150, label: "P2" }, { type: "process", size: 100, label: "P3" }, { type: "hole", size: 140, label: "Hole" }] },
    { title: "P1 completes (releases 250 KB)", layout: [{ type: "hole", size: 250, label: "Hole" }, { type: "process", size: 150, label: "P2" }, { type: "process", size: 100, label: "P3" }, { type: "hole", size: 140, label: "Hole" }] },
    { title: "P4 requests 200 KB (first-fit)", layout: [{ type: "process", size: 200, label: "P4" }, { type: "hole", size: 50, label: "Hole" }, { type: "process", size: 150, label: "P2" }, { type: "process", size: 100, label: "P3" }, { type: "hole", size: 140, label: "Hole" }] },
    { title: "P2 completes (coalesces adjacent 50 KB hole)", layout: [{ type: "process", size: 200, label: "P4" }, { type: "hole", size: 200, label: "Hole" }, { type: "process", size: 100, label: "P3" }, { type: "hole", size: 140, label: "Hole" }] }
  ];

  const handleQ7Next = () => {
    if (q7Step >= q7Events.length - 1) return;
    const nextStep = q7Step + 1;
    setQ7Step(nextStep);
    setQ7Log(prev => [...prev, `Event: ${q7Events[nextStep].title}`]);
  };

  const runCompaction = () => {
    setQ7Compacted(true);
    setQ7Log(prev => [...prev, "⚡ COMPACTION ACTIVE: Sliding process blocks left...", "Moved P3 (100 KB) left to close the 200 KB gap.", "Consolidated all free holes into a single contiguous 340 KB block. Data moved: 100 KB."]);
  };

  const allocate300 = () => {
    if (!q7Compacted) {
      setQ7Log(prev => [...prev, "❌ FAILED: Cannot allocate 300 KB! Free memory is scattered (200 KB & 140 KB holes). No contiguous block exists."]);
    } else {
      setQ7Allocated300(true);
      setQ7Log(prev => [...prev, "✅ SUCCESS: Allocated 300 KB process into the compacted 340 KB hole! Leftover hole: 40 KB."]);
    }
  };

  const resetQ7 = () => {
    setQ7Step(0);
    setQ7Log([]);
    setQ7Compacted(false);
    setQ7Allocated300(false);
  };

  // --- Q8 STATE ---
  const [q8Mode, setQ8Mode] = useState<"MFT" | "MVT">("MFT");
  const q8Workload = [120, 350, 90, 200, 400, 60];

  // --- Q9 STATE ---
  const [q9Mode, setQ9Mode] = useState<"best" | "worst">("best");
  const [q9Step, setQ9Step] = useState<number>(0);
  const q9HolesInit = [
    { name: "H1", capacity: 20, remaining: 20 },
    { name: "H2", capacity: 15, remaining: 15 },
    { name: "H3", capacity: 18, remaining: 18 },
    { name: "H4", capacity: 8, remaining: 8 },
    { name: "H5", capacity: 6, remaining: 6 }
  ];
  const [q9Holes, setQ9Holes] = useState(q9HolesInit);
  const q9Requests = [
    { name: "R1", size: 12 },
    { name: "R2", size: 10 },
    { name: "R3", size: 9 },
    { name: "R4", size: 15 }
  ];
  const [q9Log, setQ9Log] = useState<string[]>([]);

  const handleQ9Step = () => {
    if (q9Step >= q9Requests.length) return;
    const req = q9Requests[q9Step];
    const updated = [...q9Holes];
    let selectedIndex = -1;

    if (q9Mode === "best") {
      // Smallest hole that fits
      let minSize = 999;
      for (let i = 0; i < updated.length; i++) {
        if (updated[i].remaining >= req.size && updated[i].remaining < minSize) {
          minSize = updated[i].remaining;
          selectedIndex = i;
        }
      }
    } else {
      // Largest hole
      let maxSize = -1;
      for (let i = 0; i < updated.length; i++) {
        if (updated[i].remaining >= req.size && updated[i].remaining > maxSize) {
          maxSize = updated[i].remaining;
          selectedIndex = i;
        }
      }
    }

    let logMsg = "";
    if (selectedIndex !== -1) {
      const wasted = updated[selectedIndex].remaining - req.size;
      updated[selectedIndex].remaining = wasted;
      logMsg = `✅ Request ${req.name} (${req.size} KB) allocated from ${updated[selectedIndex].name}. Leftover free space = ${wasted} KB.`;
    } else {
      logMsg = `❌ Request ${req.name} (${req.size} KB) could NOT be satisfied. Sits blocked in queue.`;
    }

    setQ9Holes(updated);
    setQ9Log(prev => [...prev, logMsg]);
    setQ9Step(prev => prev + 1);
  };

  const resetQ9 = () => {
    setQ9Step(0);
    setQ9Holes(q9HolesInit);
    setQ9Log([]);
  };

  // --- Q10 STATE ---
  const [q10Solution, setQ10Solution] = useState<"compaction" | "paging">("compaction");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-900 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Part B · Memory Management Strategies</h2>
        <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">
          MFT, MVT, Best-fit vs. Worst-fit, Compaction, and Paging (Q6 - Q10)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Sidebar list of Q6-Q10 */}
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
                Syllabus Problem under Defense
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">{currentQObj.qText}</h3>
            </div>
            
            {/* Answer body */}
            <div className="space-y-4 pt-4 border-t border-gray-900">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Worked Academic Answer
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
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-gray-100 tracking-tight">Interactive Allocation Simulator</h4>
              </div>
              <span className="text-[9px] font-mono text-gray-500 uppercase">Live Memory Bus</span>
            </div>

            {/* Q6 SANDBOX - MFT FIXED PARTITION TRACER */}
            {activeQ === "Q6" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-900 pb-3 gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-gray-300">Workload Queue:</span>
                    <div className="flex gap-1 pt-1.5">
                      {q6Jobs.map((job, i) => (
                        <div key={i} className={`px-2 py-1 rounded text-[10px] font-mono font-bold border ${
                          i < q6Step ? "bg-gray-900 border-gray-800 text-gray-600 line-through" :
                          i === q6Step ? "bg-indigo-600/20 border-indigo-500 text-indigo-400 animate-pulse" :
                          "bg-gray-950 border-gray-900 text-gray-400"
                        }`}>
                          {job.name}:{job.size}K
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleQ6Step}
                      disabled={q6Step >= q6Jobs.length}
                      className="px-3.5 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Step Job</span>
                    </button>
                    <button
                      onClick={resetQ6}
                      className="p-2 rounded border border-gray-900 hover:bg-gray-900 text-gray-400"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Partitions visual slots */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                    Fixed Physical Partitions (MFT order)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {q6Partitions.map((p, i) => {
                      const waste = p.occupied ? p.size - p.jobSize : 0;
                      return (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className={`border rounded-xl p-4 min-h-[110px] flex flex-col justify-between transition-colors ${
                            p.occupied 
                              ? "bg-indigo-950/10 border-indigo-950" 
                              : "bg-gray-950/50 border-gray-900"
                          }`}>
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="font-bold text-gray-300">{p.name}</span>
                              <span className="text-gray-500">{p.size}K</span>
                            </div>

                            {p.occupied ? (
                              <div className="space-y-1 py-2 text-center bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                <span className="text-xs font-bold text-indigo-400">{p.job}</span>
                                <span className="text-[10px] text-gray-500 block">{p.jobSize}K utilized</span>
                              </div>
                            ) : (
                              <span className="text-[10.5px] italic text-gray-600 text-center py-2">Free</span>
                            )}

                            <div className="text-[9px] font-mono text-gray-500">
                              {p.occupied ? `Frag: ${waste}K` : "No waste"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step console log */}
                {q6Log.length > 0 && (
                  <div className="p-3 rounded-lg border border-gray-900 bg-gray-950 font-mono text-[10px] space-y-1 max-h-[100px] overflow-y-auto">
                    {q6Log.map((log, i) => (
                      <p key={i} className={log.includes("✅") ? "text-emerald-400" : "text-red-400 font-medium"}>
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Q7 SANDBOX - MVT TRACE & COMPACTION */}
            {activeQ === "Q7" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-900 pb-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-300">MVT Chronological Allocation Events:</span>
                    <p className="text-[10.5px] text-indigo-400 font-mono">Active Step: {q7Step} / 6 ({q7Events[q7Step].title})</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleQ7Next}
                      disabled={q7Step >= q7Events.length - 1}
                      className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>Next Event</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={resetQ7}
                      className="p-2 rounded border border-gray-900 hover:bg-gray-900 text-gray-400"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 640 KB Dynamic Memory Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>Address 0 KB</span>
                    <span>Address 640 KB</span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-12 rounded-xl border border-gray-900 bg-gray-950 overflow-hidden flex font-mono text-[10px] text-center">
                    {!q7Compacted ? (
                      // Draw current step layout
                      q7Events[q7Step].layout.map((block, index) => {
                        const pct = (block.size / 640) * 100;
                        return (
                          <div
                            key={index}
                            style={{ width: `${pct}%` }}
                            className={`h-full flex flex-col justify-center border-r border-gray-900/60 transition-all duration-300 ${
                              block.type === "process" 
                                ? "bg-indigo-500/10 text-indigo-400 font-bold" 
                                : "bg-gray-950 text-gray-600 font-medium"
                            }`}
                          >
                            <span>{block.label}</span>
                            <span className="text-[8px] opacity-75">{block.size}K</span>
                          </div>
                        );
                      })
                    ) : (
                      // Draw compacted layout
                      <>
                        <div style={{ width: "31.25%" }} className="h-full bg-indigo-500/10 text-indigo-400 font-bold flex flex-col justify-center border-r border-gray-900">
                          <span>P4</span>
                          <span className="text-[8px] opacity-75">200K</span>
                        </div>
                        {q7Allocated300 ? (
                          <>
                            <div style={{ width: "15.625%" }} className="h-full bg-indigo-500/10 text-indigo-400 font-bold flex flex-col justify-center border-r border-gray-900">
                              <span>P3</span>
                              <span className="text-[8px] opacity-75">100K</span>
                            </div>
                            <div style={{ width: "46.875%" }} className="h-full bg-emerald-500/10 text-emerald-400 font-bold flex flex-col justify-center border-r border-gray-900 animate-pulse">
                              <span>Pending Job</span>
                              <span className="text-[8px] opacity-75">300K</span>
                            </div>
                            <div style={{ width: "6.25%" }} className="h-full bg-gray-950 text-gray-600 flex flex-col justify-center">
                              <span>Hole</span>
                              <span className="text-[8px] opacity-75">40K</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ width: "15.625%" }} className="h-full bg-indigo-500/10 text-indigo-400 font-bold flex flex-col justify-center border-r border-gray-900">
                              <span>P3</span>
                              <span className="text-[8px] opacity-75">100K</span>
                            </div>
                            <div style={{ width: "53.125%" }} className="h-full bg-gray-950 text-gray-600 flex flex-col justify-center">
                              <span>Coalesced Hole</span>
                              <span className="text-[8px] opacity-75">340K</span>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Actions when timeline completes (at step 6) */}
                {q7Step === 6 && (
                  <div className="grid grid-cols-2 gap-3.5 pt-2">
                    <button
                      onClick={runCompaction}
                      disabled={q7Compacted}
                      className="py-2.5 rounded-lg border border-amber-900 hover:bg-amber-950/20 text-amber-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Run Compaction (Shift P3)</span>
                    </button>
                    <button
                      onClick={allocate300}
                      disabled={q7Allocated300}
                      className="py-2.5 rounded-lg border border-emerald-900 hover:bg-emerald-950/20 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Allocate 300 KB Job</span>
                    </button>
                  </div>
                )}

                {/* Real-time execution logs */}
                {q7Log.length > 0 && (
                  <div className="p-3 rounded-lg border border-gray-900 bg-gray-950 font-mono text-[10.5px] space-y-1">
                    {q7Log.map((log, i) => (
                      <p key={i} className={
                        log.includes("❌") ? "text-red-400 font-medium" :
                        log.includes("✅") ? "text-emerald-400 font-semibold" :
                        log.includes("COMPACTION") ? "text-amber-400 font-bold" :
                        "text-gray-400"
                      }>
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Q8 SANDBOX - MFT VS MVT WORKLOAD */}
            {activeQ === "Q8" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <span className="text-xs font-semibold text-gray-300">Select Architecture:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQ8Mode("MFT")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        q8Mode === "MFT" 
                          ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-400" 
                          : "bg-gray-900/30 border-gray-800 text-gray-500"
                      }`}
                    >
                      MFT (5 x 160 KB partitions)
                    </button>
                    <button
                      onClick={() => setQ8Mode("MVT")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        q8Mode === "MVT" 
                          ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-400" 
                          : "bg-gray-900/30 border-gray-800 text-gray-500"
                      }`}
                    >
                      MVT (800 KB, Best-fit)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Layout block */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 space-y-3">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                      Memory Architecture Result
                    </span>

                    {q8Mode === "MFT" ? (
                      <div className="space-y-2">
                        {/* 5 Partitions of 160 KB */}
                        {[
                          { name: "Part 1 (160K)", job: "120 KB", active: true, desc: "Saves 40K" },
                          { name: "Part 2 (160K)", job: "90 KB", active: true, desc: "Saves 70K" },
                          { name: "Part 3 (160K)", job: "60 KB", active: true, desc: "Saves 100K" },
                          { name: "Part 4 (160K)", job: "Blocked", active: false, desc: "Free" },
                          { name: "Part 5 (160K)", job: "Blocked", active: false, desc: "Free" }
                        ].map((part, index) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded bg-gray-900/40 border border-gray-900 font-mono text-xs">
                            <span className="text-gray-400">{part.name}:</span>
                            <span className={part.active ? "text-indigo-400 font-bold" : "text-gray-600"}>
                              {part.job} ({part.desc})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 font-mono text-xs">
                        <div className="p-2 rounded bg-gray-900/40 border border-gray-900 flex justify-between">
                          <span className="text-gray-400">P1 (120 KB):</span>
                          <span className="text-emerald-400 font-bold">Allocated</span>
                        </div>
                        <div className="p-2 rounded bg-gray-900/40 border border-gray-900 flex justify-between">
                          <span className="text-gray-400">P2 (350 KB):</span>
                          <span className="text-emerald-400 font-bold">Allocated</span>
                        </div>
                        <div className="p-2 rounded bg-gray-900/40 border border-gray-900 flex justify-between">
                          <span className="text-gray-400">P3 (90 KB):</span>
                          <span className="text-emerald-400 font-bold">Allocated</span>
                        </div>
                        <div className="p-2 rounded bg-gray-900/40 border border-gray-900 flex justify-between">
                          <span className="text-gray-400">P4 (200 KB):</span>
                          <span className="text-emerald-400 font-bold">Allocated</span>
                        </div>
                        <div className="p-2 rounded bg-red-950/20 border border-red-900/30 flex justify-between text-red-400">
                          <span>Others waiting:</span>
                          <span>400K, 60K</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Allocation Stats */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                        Comparative Outcomes
                      </span>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between border-b border-gray-900 pb-1.5">
                          <span className="text-gray-400">Degree of Multiprogramming:</span>
                          <span className="font-bold text-white">{q8Mode === "MFT" ? "3 processes" : "4 processes"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-900 pb-1.5">
                          <span className="text-gray-400">Memory Utilization:</span>
                          <span className="font-bold text-indigo-400">{q8Mode === "MFT" ? "33.75% (270 / 800)" : "95.0% (760 / 800)"}</span>
                        </div>
                        <div className="flex justify-between pb-1.5">
                          <span className="text-gray-400">Rejected jobs (too big):</span>
                          <span className="font-bold text-red-400">{q8Mode === "MFT" ? "350K, 200K, 400K" : "None"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-gray-900/30 border border-gray-900 text-[10.5px] text-gray-500 leading-relaxed font-mono">
                      {q8Mode === "MFT" 
                        ? "MFT leaves 160 KB processes permanently blocked from allocating. Jobs over 160 KB can never run."
                        : "MVT sizes slots exactly, enabling 4 large processes to run simultaneously for 95% efficiency!"
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Q9 SANDBOX - BEST FIT VS WORST FIT */}
            {activeQ === "Q9" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-900 pb-3 gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setQ9Mode("best"); resetQ9(); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        q9Mode === "best" 
                          ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-400" 
                          : "bg-gray-900/30 border-gray-800 text-gray-500"
                      }`}
                    >
                      Best-Fit Strategy
                    </button>
                    <button
                      onClick={() => { setQ9Mode("worst"); resetQ9(); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        q9Mode === "worst" 
                          ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-400" 
                          : "bg-gray-900/30 border-gray-800 text-gray-500"
                      }`}
                    >
                      Worst-Fit Strategy
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleQ9Step}
                      disabled={q9Step >= q9Requests.length}
                      className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Request {q9Requests[q9Step]?.name || "End"}</span>
                    </button>
                    <button
                      onClick={resetQ9}
                      className="p-2 rounded border border-gray-900 hover:bg-gray-900 text-gray-400"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Holes layout visualization */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                    Holes Status (H1...H5)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {q9Holes.map((hole, index) => {
                      const filledPct = ((hole.capacity - hole.remaining) / hole.capacity) * 100;
                      return (
                        <div key={index} className="p-3 rounded-lg border border-gray-900 bg-gray-950 flex flex-col justify-between min-h-[90px] font-mono text-center text-xs">
                          <div className="flex justify-between text-[9px] text-gray-500 border-b border-gray-900 pb-1">
                            <span>{hole.name}</span>
                            <span>{hole.capacity}K</span>
                          </div>

                          <div className="relative w-full h-4 bg-gray-950 border border-gray-900 rounded overflow-hidden mt-2">
                            <div style={{ width: `${filledPct}%` }} className="h-full bg-indigo-500/20" />
                          </div>

                          <span className="text-[10px] text-gray-400 font-bold block mt-2">{hole.remaining}K Left</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Console logs output */}
                {q9Log.length > 0 && (
                  <div className="p-3 rounded-lg border border-gray-900 bg-gray-950 font-mono text-[10px] space-y-1">
                    {q9Log.map((log, i) => (
                      <p key={i} className={log.includes("✅") ? "text-emerald-400" : "text-red-400 font-semibold"}>
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Q10 SANDBOX - COMPACTION VS PAGING */}
            {activeQ === "Q10" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <span className="text-xs font-semibold text-gray-300">Choose Allocation Architecture:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQ10Solution("compaction")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        q10Solution === "compaction" 
                          ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-400" 
                          : "bg-gray-900/30 border-gray-800 text-gray-500"
                      }`}
                    >
                      Compaction (Contiguous)
                    </button>
                    <button
                      onClick={() => setQ10Solution("paging")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        q10Solution === "paging" 
                          ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-400" 
                          : "bg-gray-900/30 border-gray-800 text-gray-500"
                      }`}
                    >
                      Paging (Non-contiguous)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visualizer animation */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 space-y-4 font-mono text-xs">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">
                      Physical Frame Visualizer
                    </span>

                    {q10Solution === "compaction" ? (
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-indigo-500/10 border border-indigo-500/20 flex justify-between text-indigo-400 font-bold">
                          <span>Process P1:</span>
                          <span>Contiguous Block</span>
                        </div>
                        <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-center animate-pulse text-[11px]">
                          ⚠️ PAUSED: Thread blocked for memory shifting!
                        </div>
                        <div className="p-2 rounded bg-gray-900 border border-gray-800 text-gray-500 flex justify-between">
                          <span>Free Space:</span>
                          <span>Merged 340 KB Hole</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-[11px]">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded border border-indigo-500/20 bg-indigo-500/15 text-indigo-400 font-bold text-center">
                            Page 0 → Frame 1
                          </div>
                          <div className="p-2 rounded border border-indigo-500/20 bg-indigo-500/15 text-indigo-400 font-bold text-center">
                            Page 1 → Frame 3
                          </div>
                          <div className="p-2 rounded border border-indigo-500/20 bg-indigo-500/15 text-indigo-400 font-bold text-center">
                            Page 2 → Frame 5
                          </div>
                          <div className="p-2 rounded border border-indigo-500/20 bg-indigo-500/15 text-indigo-400 font-bold text-center">
                            Page 3 → Frame 8
                          </div>
                        </div>
                        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold">
                          ✅ SUCCESS: Zero processes paused or moved!
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Explanation card */}
                  <div className="p-4 rounded-xl border border-gray-900 bg-gray-950 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                        Cost Analysis
                      </span>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        {q10Solution === "compaction" 
                          ? "Compaction requires copying physical memory bytes to consolidate holes. This results in heavy CPU processing cycles, freezes thread executions, and causes noticeable latency."
                          : "Paging divides a process into uniform pages and physical memory into matching frames. Processes can map to scattered free frames non-contiguously, completely eliminating external fragmentation with zero copy overhead!"
                        }
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-gray-900/30 border border-gray-900 text-[10px] text-gray-500 font-mono">
                      {q10Solution === "compaction" 
                        ? "Drawback: Copy overhead is proportional to memory size."
                        : "Advantage: Zero external fragmentation, fast allocations."
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
