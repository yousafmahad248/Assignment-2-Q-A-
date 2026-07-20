import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Shuffle, 
  Play, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Cpu, 
  Layers, 
  CheckCircle, 
  Clock, 
  Activity, 
  HelpCircle,
  Eye
} from "lucide-react";
import { Process, SimulationResult, AlgorithmNotes } from "../types";
import { GanttChart } from "../components/GanttChart";
import { BarCharts } from "../components/BarCharts";
import { useToast } from "../components/Toast";

interface AlgorithmDetailProps {
  algorithmId: "fcfs" | "sjf" | "priority";
}

export const AlgorithmDetail: React.FC<AlgorithmDetailProps> = ({ algorithmId }) => {
  const { showToast } = useToast();
  const [notes, setNotes] = useState<AlgorithmNotes | null>(null);
  const [loadingNotes, setLoadingNotes] = useState<boolean>(true);

  // Simulator Inputs
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", arrivalTime: 0, burstTime: 5, priority: 1 },
    { id: "P2", arrivalTime: 1, burstTime: 3, priority: 3 },
    { id: "P3", arrivalTime: 2, burstTime: 8, priority: 2 },
    { id: "P4", arrivalTime: 3, burstTime: 2, priority: 4 },
  ]);

  const [newId, setNewId] = useState<string>("P5");
  const [newArrival, setNewArrival] = useState<number>(0);
  const [newBurst, setNewBurst] = useState<number>(1);
  const [newPriority, setNewPriority] = useState<number>(1);

  // Algorithm configuration
  const [preemptive, setPreemptive] = useState<boolean>(false);
  const [lowerIsHigher, setLowerIsHigher] = useState<boolean>(true);

  // Simulation outputs
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Reset toggles when switching algorithm page
  useEffect(() => {
    setPreemptive(false);
    setResult(null);
    fetchAlgorithmNotes();
    // Auto increment process ID
    const nextNum = processes.length + 1;
    setNewId(`P${nextNum}`);
  }, [algorithmId]);

  // Sync process name increment
  useEffect(() => {
    const ids = processes.map(p => {
      const match = p.id.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    });
    const maxVal = ids.length > 0 ? Math.max(...ids) : 0;
    setNewId(`P${maxVal + 1}`);
  }, [processes]);

  const fetchAlgorithmNotes = async () => {
    setLoadingNotes(true);
    try {
      const res = await axios.get("/api/notes");
      const found = res.data.find((n: any) => n.id === algorithmId);
      if (found) {
        setNotes(found);
      } else {
        throw new Error("Notes not found");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      // Fallback local description if server notes are unavailable
      const fallbacks: Record<string, AlgorithmNotes> = {
        fcfs: {
          id: "fcfs",
          algorithm: "First-Come, First-Served (FCFS)",
          introduction: "First-Come First-Served (FCFS) is the simplest scheduling algorithm.",
          working: "The process requesting the CPU first is allocated first.",
          advantages: "Simple, easy to code.",
          disadvantages: "Convoy effect can occur.",
          timeComplexity: "O(N log N)",
          useCases: "Batch processing systems.",
          realLifeExample: "grocery store checkout line."
        },
        sjf: {
          id: "sjf",
          algorithm: "Shortest Job First (SJF)",
          introduction: "Shortest Job First schedules jobs with minimal burst length first.",
          working: "Chooses the shortest CPU burst next.",
          advantages: "Guarantees optimal average wait time.",
          disadvantages: "Risk of starvation for long burst jobs.",
          timeComplexity: "O(N log N)",
          useCases: "Job schedules with known durations.",
          realLifeExample: "printing system priority queue."
        },
        priority: {
          id: "priority",
          algorithm: "Priority Scheduling",
          introduction: "Priority Scheduling assigns CPU based on numerical urgency.",
          working: "Picks ready process with high priority levels.",
          advantages: "Supports strict task importance schedules.",
          disadvantages: "Low priority jobs can suffer starvation.",
          timeComplexity: "O(N log N)",
          useCases: "Real-time kernel thread dispatches.",
          realLifeExample: "hospital emergency room queue."
        }
      };
      setNotes(fallbacks[algorithmId]);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAddProcess = () => {
    // Validate
    if (!newId.trim()) {
      showToast("Process ID cannot be empty", "error");
      return;
    }
    if (processes.some(p => p.id.toLowerCase() === newId.trim().toLowerCase())) {
      showToast(`Process ID '${newId}' already exists`, "error");
      return;
    }
    if (newArrival < 0 || newBurst <= 0 || newPriority < 0) {
      showToast("Arrival/Priority must be >= 0 and Burst must be > 0", "error");
      return;
    }

    const nextP: Process = {
      id: newId.trim(),
      arrivalTime: Number(newArrival),
      burstTime: Number(newBurst),
      priority: Number(newPriority)
    };

    setProcesses([...processes, nextP]);
    showToast(`Added Process ${nextP.id}`, "success");

    // Reset inputs
    setNewArrival(0);
    setNewBurst(1);
    setNewPriority(1);
  };

  const handleDeleteProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
    showToast(`Deleted Process ${id}`, "info");
  };

  const handleClear = () => {
    setProcesses([]);
    setResult(null);
    showToast("Cleared process queue", "info");
  };

  const handleGenerateExample = () => {
    const examples: Record<string, Process[]> = {
      fcfs: [
        { id: "P1", arrivalTime: 0, burstTime: 24, priority: 1 },
        { id: "P2", arrivalTime: 1, burstTime: 3, priority: 1 },
        { id: "P3", arrivalTime: 2, burstTime: 3, priority: 1 },
      ],
      sjf: [
        { id: "P1", arrivalTime: 0, burstTime: 8, priority: 1 },
        { id: "P2", arrivalTime: 1, burstTime: 4, priority: 1 },
        { id: "P3", arrivalTime: 2, burstTime: 9, priority: 1 },
        { id: "P4", arrivalTime: 3, burstTime: 5, priority: 1 },
      ],
      priority: [
        { id: "P1", arrivalTime: 0, burstTime: 10, priority: 3 },
        { id: "P2", arrivalTime: 1, burstTime: 1, priority: 1 },
        { id: "P3", arrivalTime: 2, burstTime: 2, priority: 4 },
        { id: "P4", arrivalTime: 3, burstTime: 1, priority: 5 },
        { id: "P5", arrivalTime: 4, burstTime: 5, priority: 2 },
      ]
    };
    setProcesses(examples[algorithmId]);
    setResult(null);
    showToast("Loaded textbook example cases", "success");
  };

  const handleGenerateRandom = () => {
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 processes
    const randoms: Process[] = Array.from({ length: count }, (_, i) => ({
      id: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * 6), // 0 to 5
      burstTime: Math.floor(Math.random() * 10) + 1, // 1 to 10
      priority: Math.floor(Math.random() * 5) + 1, // 1 to 5
    }));
    setProcesses(randoms);
    setResult(null);
    showToast("Generated random simulation parameters", "success");
  };

  const handleRunSimulation = async () => {
    if (processes.length === 0) {
      showToast("Please add at least one process to simulate!", "error");
      return;
    }

    setIsSimulating(true);
    try {
      const payload: any = { processes };
      if (algorithmId === "sjf") {
        payload.preemptive = preemptive;
      } else if (algorithmId === "priority") {
        payload.preemptive = preemptive;
        payload.lowerIsHigher = lowerIsHigher;
      }

      const response = await axios.post(`/api/${algorithmId}`, payload);
      setResult(response.data);
      showToast("Simulation computed successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.error || "Failed to execute simulation", "error");
    } finally {
      setIsSimulating(false);
    }
  };

  const exportToCSV = () => {
    if (!result) return;
    const headers = ["Process ID", "Arrival Time", "Burst Time", "Priority", "Start Time", "Completion Time", "Turnaround Time", "Waiting Time", "Response Time"];
    const rows = result.processes.map(p => [
      p.id,
      p.arrivalTime,
      p.burstTime,
      p.priority,
      p.startTime ?? "",
      p.completionTime ?? "",
      p.turnaroundTime ?? "",
      p.waitingTime ?? "",
      p.responseTime ?? ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CPU_Scheduling_${algorithmId.toUpperCase()}_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV file downloaded successfully", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10">
      {/* 1. Header & Quick Simulator Activation */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Cpu className="w-6 h-6 text-indigo-500" />
            <span>{notes?.algorithm || "CPU Scheduling Algorithm"}</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mt-1">
            interactive visual simulation module
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateExample}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Load Preset</span>
          </button>
          <button
            onClick={handleGenerateRandom}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>
        </div>
      </section>

      {/* 2. Educational Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Intro & Working (Glassmorphism block) */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-gray-900 bg-gray-950/40 space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
              Introduction
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {loadingNotes ? "Loading parameters..." : notes?.introduction}
            </p>
          </div>
          <div className="pt-3 border-t border-gray-900/40">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
              How it Works
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
              {loadingNotes ? "Loading guidelines..." : notes?.working}
            </p>
          </div>
        </div>

        {/* Right Column: Time Complexity & Use Cases */}
        <div className="p-6 rounded-xl border border-gray-900 bg-gray-950/20 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">
              Complexity Profile
            </h4>
            <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg font-mono text-xs text-gray-400">
              {loadingNotes ? "..." : notes?.timeComplexity}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
              Industry Use Cases
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {loadingNotes ? "..." : notes?.useCases}
            </p>
          </div>
          <div className="pt-2 border-t border-gray-900/50">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Real-world Metaphor
            </h4>
            <p className="text-[11px] italic text-gray-500">
              "{loadingNotes ? "..." : notes?.realLifeExample}"
            </p>
          </div>
        </div>
      </section>

      {/* 3. Simulator Control Panel */}
      <section className="bg-gray-950/40 border border-gray-900 rounded-xl p-6 shadow-md space-y-6">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 border-b border-gray-900 pb-3">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>Interactive Setup Board</span>
        </h3>

        {/* Mode options for SJF & Priority */}
        {(algorithmId === "sjf" || algorithmId === "priority") && (
          <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-950 rounded-lg border border-gray-900">
            {/* Preemptive toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={preemptive}
                onChange={(e) => setPreemptive(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-gray-900 border-gray-800 focus:ring-0 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                  Preemptive Dispatch Mode
                </span>
                <span className="text-[10px] text-gray-500">
                  {algorithmId === "sjf" ? "SRTF (Shortest Remaining Time First)" : "Preempt on urgency check"}
                </span>
              </div>
            </label>

            {/* Priority Order select */}
            {algorithmId === "priority" && (
              <label className="flex items-center gap-3 cursor-pointer group border-l border-gray-900 pl-6">
                <input
                  type="checkbox"
                  checked={lowerIsHigher}
                  onChange={(e) => setLowerIsHigher(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-gray-900 border-gray-800 focus:ring-0 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                    Lower Number = Higher Priority
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {lowerIsHigher ? "Priority 1 > Priority 5 (Standard OS)" : "Priority 5 > Priority 1"}
                  </span>
                </div>
              </label>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-1 bg-gray-950 p-5 rounded-lg border border-gray-900 space-y-4 h-fit">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest border-b border-gray-900 pb-2">
              Add Process Data
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-500 font-semibold block mb-1">Process Name</label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. P1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold block mb-1">Arrival Time</label>
                  <input
                    type="number"
                    min="0"
                    value={newArrival}
                    onChange={(e) => setNewArrival(parseInt(e.target.value) || 0)}
                    className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold block mb-1">Burst Time</label>
                  <input
                    type="number"
                    min="1"
                    value={newBurst}
                    onChange={(e) => setNewBurst(parseInt(e.target.value) || 1)}
                    className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {algorithmId === "priority" && (
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold block mb-1">Urgency Priority</label>
                  <input
                    type="number"
                    min="0"
                    value={newPriority}
                    onChange={(e) => setNewPriority(parseInt(e.target.value) || 1)}
                    className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              )}

              <button
                onClick={handleAddProcess}
                className="w-full mt-2 flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Process</span>
              </button>
            </div>
          </div>

          {/* Current Processes List Table */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Active Ready Queue ({processes.length} Processes)
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 text-[11px] text-rose-400 border border-rose-500/10 hover:border-rose-500/30 hover:bg-rose-500/10 rounded transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Queue</span>
                </button>
              </div>
            </div>

            {processes.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-900 rounded-lg bg-gray-950/50 text-center">
                <Layers className="w-8 h-8 text-gray-700 mb-2" />
                <p className="text-xs text-gray-500">The Ready Queue is empty. Load a preset or input processes manually to start.</p>
              </div>
            ) : (
              <div className="border border-gray-900 rounded-lg overflow-hidden bg-gray-950/20 max-h-64 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-950 text-[10px] text-gray-500 uppercase font-semibold font-mono border-b border-gray-900">
                      <th className="p-3">Process ID</th>
                      <th className="p-3 text-center">Arrival Time (AT)</th>
                      <th className="p-3 text-center">Burst Time (BT)</th>
                      {algorithmId === "priority" && <th className="p-3 text-center">Priority</th>}
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900 text-xs">
                    {processes.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-900/40 text-gray-300">
                        <td className="p-3 font-semibold text-gray-200">{p.id}</td>
                        <td className="p-3 text-center font-mono">{p.arrivalTime}</td>
                        <td className="p-3 text-center font-mono">{p.burstTime}</td>
                        {algorithmId === "priority" && (
                          <td className="p-3 text-center font-mono">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                              {p.priority}
                            </span>
                          </td>
                        )}
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProcess(p.id)}
                            className="p-1 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                            title="Delete Process"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {processes.length > 0 && (
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>Run {algorithmId.toUpperCase()} Simulator</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Simulation Results Panel */}
      {result && (
        <section id="print-area" className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Simulation Results</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-mono">
                COMPUTED DIRECTLY ON LAB HOST BACKEND
              </p>
            </div>
            <div className="flex items-center gap-3 no-print">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-900 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF Summary</span>
              </button>
            </div>
          </div>

          {/* Core Analytics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 font-semibold uppercase font-mono block">
                Avg Waiting Time
              </span>
              <span className="text-xl font-bold text-indigo-400 font-mono">
                {result.avgWaitingTime} <span className="text-xs font-normal text-gray-500">ms</span>
              </span>
            </div>

            <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 font-semibold uppercase font-mono block">
                Avg Turnaround Time
              </span>
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {result.avgTurnaroundTime} <span className="text-xs font-normal text-gray-500">ms</span>
              </span>
            </div>

            <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 font-semibold uppercase font-mono block">
                Avg Response Time
              </span>
              <span className="text-xl font-bold text-amber-500 font-mono">
                {result.avgResponseTime || 0} <span className="text-xs font-normal text-gray-500">ms</span>
              </span>
            </div>

            <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 font-semibold uppercase font-mono block">
                CPU Utilization
              </span>
              <span className="text-xl font-bold text-cyan-400 font-mono">
                {result.cpuUtilization}%
              </span>
            </div>

            <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl col-span-2 lg:col-span-1 space-y-1">
              <span className="text-[10px] text-gray-500 font-semibold uppercase font-mono block">
                Throughput
              </span>
              <span className="text-xl font-bold text-rose-400 font-mono">
                {result.throughput} <span className="text-[10px] font-normal text-gray-500">p/ms</span>
              </span>
            </div>
          </div>

          {/* Gantt Chart rendering */}
          <GanttChart blocks={result.ganttChart} />

          {/* Main detailed processes metrics table */}
          <div className="space-y-3 bg-gray-950/20 border border-gray-900 rounded-xl p-5 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Process Evaluation Table
            </h4>
            <div className="border border-gray-900 rounded-lg overflow-hidden bg-gray-950 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-gray-950 text-[10px] text-gray-500 uppercase border-b border-gray-900 font-semibold">
                    <th className="p-3">Process ID</th>
                    <th className="p-3 text-center">Arrival (AT)</th>
                    <th className="p-3 text-center">Burst (BT)</th>
                    {algorithmId === "priority" && <th className="p-3 text-center">Priority</th>}
                    <th className="p-3 text-center bg-gray-900/30">Start (ST)</th>
                    <th className="p-3 text-center bg-gray-900/30">Completion (CT)</th>
                    <th className="p-3 text-center text-indigo-400 font-semibold">Turnaround (TAT)</th>
                    <th className="p-3 text-center text-emerald-400 font-semibold">Waiting (WT)</th>
                    <th className="p-3 text-center text-amber-500 font-semibold">Response (RT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900 text-gray-300">
                  {result.processes.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-900/30">
                      <td className="p-3 font-sans font-semibold text-gray-200">{p.id}</td>
                      <td className="p-3 text-center">{p.arrivalTime}</td>
                      <td className="p-3 text-center">{p.burstTime}</td>
                      {algorithmId === "priority" && <td className="p-3 text-center font-semibold text-amber-500">{p.priority}</td>}
                      <td className="p-3 text-center bg-gray-900/10 text-gray-400">{p.startTime ?? 0}</td>
                      <td className="p-3 text-center bg-gray-900/10 text-gray-400">{p.completionTime ?? 0}</td>
                      <td className="p-3 text-center text-indigo-400 font-bold">{p.turnaroundTime ?? 0}</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">{p.waitingTime ?? 0}</td>
                      <td className="p-3 text-center text-amber-500 font-bold">{p.responseTime ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-1 pt-2 text-[11px] text-gray-500">
              <p>• Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)</p>
              <p>• Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)</p>
              <p>• Response Time (RT) = First Run Time (ST) - Arrival Time (AT)</p>
            </div>
          </div>

          {/* Interactive Bar charts from Recharts */}
          <div className="no-print">
            <BarCharts processes={result.processes} />
          </div>
        </section>
      )}
    </div>
  );
};
