import React from "react";
import { GanttBlock } from "../types";

interface GanttChartProps {
  blocks: GanttBlock[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ blocks }) => {
  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-800 rounded-lg bg-gray-900/40 text-gray-500">
        <p className="text-sm">No Gantt chart data available. Run the simulator first.</p>
      </div>
    );
  }

  // Pre-defined modern colors for processes
  const getProcessColor = (id: string) => {
    if (id === "Idle") return "bg-gray-800 border-gray-700 text-gray-500";
    
    // Hash of process id to cycle through colors
    const colors = [
      "bg-indigo-600/20 border-indigo-500 text-indigo-400 hover:bg-indigo-600/30",
      "bg-emerald-600/20 border-emerald-500 text-emerald-400 hover:bg-emerald-600/30",
      "bg-amber-600/20 border-amber-500 text-amber-400 hover:bg-amber-600/30",
      "bg-rose-600/20 border-rose-500 text-rose-400 hover:bg-rose-600/30",
      "bg-cyan-600/20 border-cyan-500 text-cyan-400 hover:bg-cyan-600/30",
      "bg-fuchsia-600/20 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-600/30",
      "bg-teal-600/20 border-teal-500 text-teal-400 hover:bg-teal-600/30",
      "bg-violet-600/20 border-violet-500 text-violet-400 hover:bg-violet-600/30",
    ];

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Calculate total time
  const totalDuration = blocks[blocks.length - 1].end;

  return (
    <div className="w-full bg-gray-950 border border-gray-900 rounded-xl p-6 shadow-md overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Gantt Chart (Execution Timeline)
        </h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-3 rounded bg-indigo-500/20 border border-indigo-500"></span>
            <span>Processes</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-3 rounded bg-gray-800 border border-gray-700"></span>
            <span>CPU Idle</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="min-w-[600px] mt-2">
          {/* Blocks Row */}
          <div className="flex w-full h-12 bg-gray-900/30 rounded-lg overflow-hidden border border-gray-950 divide-x divide-gray-950 shadow-inner">
            {blocks.map((block, idx) => {
              const duration = block.end - block.start;
              const widthPct = (duration / totalDuration) * 100;
              return (
                <div
                  key={idx}
                  style={{ width: `${widthPct}%` }}
                  className={`flex flex-col items-center justify-center text-xs font-semibold border-y relative transition-all ${getProcessColor(
                    block.processId
                  )}`}
                  title={`${block.processId}: ${block.start} - ${block.end} (Duration: ${duration})`}
                >
                  <span className="truncate max-w-full px-1">{block.processId}</span>
                  <span className="text-[9px] opacity-70">d: {duration}</span>
                </div>
              );
            })}
          </div>

          {/* Time ticks Row */}
          <div className="flex w-full mt-2 relative h-6 text-[10px] text-gray-500 font-mono">
            {/* First tick */}
            <span className="absolute left-0 -translate-x-1/2">0</span>
            
            {blocks.map((block, idx) => {
              const rightPct = (block.end / totalDuration) * 100;
              return (
                <span
                  key={idx}
                  style={{ left: `${rightPct}%` }}
                  className="absolute -translate-x-1/2 border-l border-gray-800 pt-1"
                >
                  {block.end}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
