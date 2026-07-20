export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime?: number;
  startTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  responseTime?: number;
}

export interface GanttBlock {
  processId: string; // 'Idle' or Process ID
  start: number;
  end: number;
}

export interface SimulationResult {
  processes: Process[];
  ganttChart: GanttBlock[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

// 1. FCFS Scheduling (First-Come, First-Served) - Always Non-Preemptive
export function runFCFS(inputProcesses: Process[]): SimulationResult {
  // Deep copy processes
  const processes: Process[] = inputProcesses.map(p => ({
    ...p,
    remainingTime: p.burstTime,
  }));

  // Sort by arrival time. If same arrival time, sort by original order / process ID
  processes.sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return a.id.localeCompare(b.id);
  });

  const ganttChart: GanttBlock[] = [];
  let currentTime = 0;
  let totalBusyTime = 0;

  for (const p of processes) {
    if (currentTime < p.arrivalTime) {
      // CPU is idle before this process arrives
      ganttChart.push({
        processId: "Idle",
        start: currentTime,
        end: p.arrivalTime,
      });
      currentTime = p.arrivalTime;
    }

    p.startTime = currentTime;
    p.completionTime = currentTime + p.burstTime;
    p.turnaroundTime = p.completionTime - p.arrivalTime;
    p.waitingTime = p.turnaroundTime - p.burstTime;
    p.responseTime = p.startTime - p.arrivalTime;

    ganttChart.push({
      processId: p.id,
      start: p.startTime,
      end: p.completionTime,
    });

    currentTime = p.completionTime;
    totalBusyTime += p.burstTime;
  }

  const numProcesses = processes.length;
  const totalDuration = currentTime;

  const avgWaitingTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const avgTurnaroundTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const avgResponseTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.responseTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const cpuUtilization = totalDuration > 0 
    ? parseFloat(((totalBusyTime / totalDuration) * 100).toFixed(2)) 
    : 0;
  const throughput = totalDuration > 0 
    ? parseFloat((numProcesses / totalDuration).toFixed(4)) 
    : 0;

  return {
    processes,
    ganttChart,
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    throughput,
  };
}

// 2. SJF (Shortest Job First) - Can be Preemptive (SRTF) or Non-Preemptive
export function runSJF(inputProcesses: Process[], preemptive: boolean): SimulationResult {
  const processes: Process[] = inputProcesses.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: undefined,
    completionTime: undefined,
  }));

  const ganttChart: GanttBlock[] = [];
  let currentTime = 0;
  let completed = 0;
  const numProcesses = processes.length;
  let currentProcessId: string | null = null;
  let currentBlockStart = 0;
  let totalBusyTime = 0;

  // Track executing state tick-by-tick
  const tickTimeline: { time: number; id: string }[] = [];

  while (completed < numProcesses) {
    // Find all processes that have arrived and are not finished
    const available = processes.filter(p => p.arrivalTime <= currentTime && (p.remainingTime ?? 0) > 0);

    if (available.length === 0) {
      // No process is available, CPU is idle
      tickTimeline.push({ time: currentTime, id: "Idle" });
      currentTime++;
      continue;
    }

    let selected: Process;

    if (preemptive) {
      // SRTF: Pick process with shortest remaining time
      selected = available.reduce((min, p) => {
        const pRem = p.remainingTime ?? 0;
        const minRem = min.remainingTime ?? 0;
        if (pRem !== minRem) {
          return pRem < minRem ? p : min;
        }
        // Tie-breaker: earlier arrival time
        if (p.arrivalTime !== min.arrivalTime) {
          return p.arrivalTime < min.arrivalTime ? p : min;
        }
        return p.id.localeCompare(min.id) < 0 ? p : min;
      });
    } else {
      // Non-Preemptive SJF
      // If a process is already running and hasn't finished, continue running it
      if (currentProcessId && currentProcessId !== "Idle") {
        const running = processes.find(p => p.id === currentProcessId);
        if (running && (running.remainingTime ?? 0) > 0) {
          selected = running;
        } else {
          selected = selectShortest(available);
        }
      } else {
        selected = selectShortest(available);
      }
    }

    // Record start time if running for the first time
    if (selected.startTime === undefined) {
      selected.startTime = currentTime;
    }

    selected.remainingTime = (selected.remainingTime ?? 0) - 1;
    tickTimeline.push({ time: currentTime, id: selected.id });
    totalBusyTime++;
    currentProcessId = selected.id;

    if (selected.remainingTime === 0) {
      selected.completionTime = currentTime + 1;
      selected.turnaroundTime = selected.completionTime - selected.arrivalTime;
      selected.waitingTime = selected.turnaroundTime - selected.burstTime;
      selected.responseTime = selected.startTime - selected.arrivalTime;
      completed++;
      currentProcessId = null; // Clear so next iteration chooses a new one
    }

    currentTime++;
  }

  // Compress tickTimeline into GanttBlocks
  if (tickTimeline.length > 0) {
    let prevId = tickTimeline[0].id;
    let start = tickTimeline[0].time;

    for (let i = 1; i < tickTimeline.length; i++) {
      if (tickTimeline[i].id !== prevId) {
        ganttChart.push({ processId: prevId, start, end: tickTimeline[i].time });
        prevId = tickTimeline[i].id;
        start = tickTimeline[i].time;
      }
    }
    ganttChart.push({ processId: prevId, start, end: currentTime });
  }

  const totalDuration = currentTime;
  const avgWaitingTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const avgTurnaroundTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const avgResponseTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.responseTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const cpuUtilization = totalDuration > 0 
    ? parseFloat(((totalBusyTime / totalDuration) * 100).toFixed(2)) 
    : 0;
  const throughput = totalDuration > 0 
    ? parseFloat((numProcesses / totalDuration).toFixed(4)) 
    : 0;

  return {
    processes,
    ganttChart,
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    throughput,
  };
}

function selectShortest(available: Process[]): Process {
  return available.reduce((min, p) => {
    if (p.burstTime !== min.burstTime) {
      return p.burstTime < min.burstTime ? p : min;
    }
    if (p.arrivalTime !== min.arrivalTime) {
      return p.arrivalTime < min.arrivalTime ? p : min;
    }
    return p.id.localeCompare(min.id) < 0 ? p : min;
  });
}

// 3. Priority Scheduling - Preemptive or Non-Preemptive, support 'lowerIsHigher' priority level
export function runPriority(
  inputProcesses: Process[], 
  preemptive: boolean, 
  lowerIsHigher: boolean = true
): SimulationResult {
  const processes: Process[] = inputProcesses.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: undefined,
    completionTime: undefined,
  }));

  const ganttChart: GanttBlock[] = [];
  let currentTime = 0;
  let completed = 0;
  const numProcesses = processes.length;
  let currentProcessId: string | null = null;
  let totalBusyTime = 0;

  const tickTimeline: { time: number; id: string }[] = [];

  while (completed < numProcesses) {
    const available = processes.filter(p => p.arrivalTime <= currentTime && (p.remainingTime ?? 0) > 0);

    if (available.length === 0) {
      tickTimeline.push({ time: currentTime, id: "Idle" });
      currentTime++;
      continue;
    }

    let selected: Process;

    if (preemptive) {
      selected = selectByPriority(available, lowerIsHigher);
    } else {
      if (currentProcessId && currentProcessId !== "Idle") {
        const running = processes.find(p => p.id === currentProcessId);
        if (running && (running.remainingTime ?? 0) > 0) {
          selected = running;
        } else {
          selected = selectByPriority(available, lowerIsHigher);
        }
      } else {
        selected = selectByPriority(available, lowerIsHigher);
      }
    }

    if (selected.startTime === undefined) {
      selected.startTime = currentTime;
    }

    selected.remainingTime = (selected.remainingTime ?? 0) - 1;
    tickTimeline.push({ time: currentTime, id: selected.id });
    totalBusyTime++;
    currentProcessId = selected.id;

    if (selected.remainingTime === 0) {
      selected.completionTime = currentTime + 1;
      selected.turnaroundTime = selected.completionTime - selected.arrivalTime;
      selected.waitingTime = selected.turnaroundTime - selected.burstTime;
      selected.responseTime = selected.startTime - selected.arrivalTime;
      completed++;
      currentProcessId = null;
    }

    currentTime++;
  }

  // Compress tickTimeline into GanttBlocks
  if (tickTimeline.length > 0) {
    let prevId = tickTimeline[0].id;
    let start = tickTimeline[0].time;

    for (let i = 1; i < tickTimeline.length; i++) {
      if (tickTimeline[i].id !== prevId) {
        ganttChart.push({ processId: prevId, start, end: tickTimeline[i].time });
        prevId = tickTimeline[i].id;
        start = tickTimeline[i].time;
      }
    }
    ganttChart.push({ processId: prevId, start, end: currentTime });
  }

  const totalDuration = currentTime;
  const avgWaitingTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const avgTurnaroundTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const avgResponseTime = numProcesses > 0 
    ? parseFloat((processes.reduce((sum, p) => sum + (p.responseTime || 0), 0) / numProcesses).toFixed(2)) 
    : 0;
  const cpuUtilization = totalDuration > 0 
    ? parseFloat(((totalBusyTime / totalDuration) * 100).toFixed(2)) 
    : 0;
  const throughput = totalDuration > 0 
    ? parseFloat((numProcesses / totalDuration).toFixed(4)) 
    : 0;

  return {
    processes,
    ganttChart,
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    throughput,
  };
}

function selectByPriority(available: Process[], lowerIsHigher: boolean): Process {
  return available.reduce((best, p) => {
    const isBetter = lowerIsHigher ? p.priority < best.priority : p.priority > best.priority;
    if (isBetter) {
      return p;
    } else if (p.priority === best.priority) {
      // Tie-breaker: earlier arrival time
      if (p.arrivalTime !== best.arrivalTime) {
        return p.arrivalTime < best.arrivalTime ? p : best;
      }
      return p.id.localeCompare(best.id) < 0 ? p : best;
    }
    return best;
  });
}
