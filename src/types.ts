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
  processId: string;
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

export interface VivaQuestion {
  id: string;
  title: string;
  question: string;
  answer: string;
  example: string;
  importantPoints: string[];
  category: string;
}

export interface AlgorithmNotes {
  id: string;
  algorithm: string;
  introduction: string;
  working: string;
  advantages: string;
  disadvantages: string;
  timeComplexity: string;
  useCases: string;
  realLifeExample: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}
