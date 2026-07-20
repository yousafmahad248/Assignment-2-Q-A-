import React, { useState } from "react";
import { 
  HelpCircle, 
  RotateCcw, 
  Check, 
  X, 
  BookOpen, 
  Sparkles, 
  Filter, 
  ArrowRight 
} from "lucide-react";
import { QuizQuestion } from "../types";

export const Quiz: React.FC = () => {
  const quizQuestions: QuizQuestion[] = [
    {
      id: "1",
      category: "General OS",
      question: "Which of the following scheduling criteria is associated with the total time interval from submission of a process to its completion?",
      options: [
        "Waiting Time",
        "Response Time",
        "Turnaround Time",
        "Throughput"
      ],
      correctIndex: 2,
      explanation: "Turnaround Time (TAT) is the total elapsed time from the moment a process is submitted to the ready queue until the moment it finishes executing. Formula: TAT = Completion Time - Arrival Time."
    },
    {
      id: "2",
      category: "General OS",
      question: "What is context switching in operating systems?",
      options: [
        "Swapping active memory processes to disk storage",
        "Saving the state of a running process and loading the state of another ready process",
        "Changing process state from running directly to ready without OS interrupts",
        "Schedules user requests sequentially using FIFO"
      ],
      correctIndex: 1,
      explanation: "Context switching is the physical save-and-load procedure performed by the OS kernel to stop a running process, save its registers/status in its Process Control Block (PCB), and resume another process. It is pure computational overhead."
    },
    {
      id: "3",
      category: "FCFS",
      question: "Which major drawback occurs in First-Come, First-Served (FCFS) scheduling when a very long CPU-bound process blocks multiple short processes?",
      options: [
        "Starvation",
        "Convoy Effect",
        "Belady's Anomaly",
        "Priority Inversion"
      ],
      correctIndex: 1,
      explanation: "The Convoy Effect describes a performance degradation state in FCFS scheduling where a single long CPU-intensive process occupies the processor, forcing multiple extremely short I/O-bound processes to sit idle, creating poor device and CPU utilization."
    },
    {
      id: "4",
      category: "SJF",
      question: "Shortest Job First (SJF) scheduling is optimal because it guarantees:",
      options: [
        "Maximum possible throughput",
        "The minimum average waiting time for a given set of processes",
        "Perfect fairness to CPU-bound processes",
        "Minimum context-switching overhead"
      ],
      correctIndex: 1,
      explanation: "SJF is mathematically optimal because it schedules processes with the shortest burst lengths first. This clears short tasks out of the queue quickly, minimizing the cumulative waiting times of remaining processes."
    },
    {
      id: "5",
      category: "SJF",
      question: "Preemptive Shortest Job First scheduling is also known as:",
      options: [
        "Round Robin Scheduling",
        "Shortest Remaining Time First (SRTF)",
        "Shortest Process Next (SPN)",
        "Priority Dispatching"
      ],
      correctIndex: 1,
      explanation: "Preemptive SJF is standardly called Shortest Remaining Time First (SRTF). At any point in time, if a new process arrives with a remaining burst length less than the active process, preemption takes place."
    },
    {
      id: "6",
      category: "Priority",
      question: "What is the primary purpose of 'Aging' in Priority Scheduling systems?",
      options: [
        "To terminate processes that have run past their quota limit",
        "To prevent starvation of low-priority processes by gradually increasing priority over time",
        "To reduce context-switching frequency in real-time clocks",
        "To swap deadlocked processes directly into secondary swap-files"
      ],
      correctIndex: 1,
      explanation: "Starvation is a key hazard of Priority scheduling where low-priority jobs sit stalled indefinitely. 'Aging' is a dynamic kernel compensation technique where a waiting process has its priority gradually elevated as time ticks by."
    },
    {
      id: "7",
      category: "General OS",
      question: "Which component of the OS is responsible for taking over the CPU after the short-term scheduler selects a process?",
      options: [
        "The Spooler",
        "The Assembler",
        "The Dispatcher",
        "The Interrupt Handler"
      ],
      correctIndex: 2,
      explanation: "The Dispatcher is the module that actually gives control of the CPU to the process selected by the short-term scheduler. It handles context switching, jumping to the proper location in the user program, and switching to user mode."
    },
    {
      id: "8",
      category: "Priority",
      question: "In standard UNIX/Linux environments, a higher 'nice value' indicates:",
      options: [
        "A higher process priority (takes CPU precedence)",
        "A lower process priority (is 'nice' to other processes)",
        "The process is safe from kernel preemptions",
        "The process requires no context switching"
      ],
      correctIndex: 1,
      explanation: "In UNIX systems, nice values represent a voluntary surrender of CPU scheduling priority. A higher nice value (+19) means the process is 'nicer' to other system threads, giving them CPU priority. Hence, higher nice values mean lower scheduling priority."
    }
  ];

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const filteredQuestions = activeCategory === "All"
    ? quizQuestions
    : quizQuestions.filter(q => q.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const handleOptionClick = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    if (optIdx === filteredQuestions[currentIdx].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < filteredQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const categories = ["All", "General OS", "FCFS", "SJF", "Priority"];

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <span>Scheduling MCQ Quiz</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mt-1">
            evaluate your process dispatch competencies
          </p>
        </div>
        
        {/* Category filtering tab */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                  : "text-gray-500 hover:text-gray-300 bg-gray-950 border border-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center border border-gray-900 bg-gray-950/40 rounded-xl">
          <p className="text-xs text-gray-500">No questions available under this category.</p>
        </div>
      ) : quizFinished ? (
        /* Quiz Finished Screen */
        <div className="p-8 border border-gray-900 bg-gray-950/40 rounded-xl space-y-6 text-center animate-fade-in">
          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Quiz Completed!</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Excellent! You have finished the practice run. Review your score below to gauge your readiness for university OS lab evaluations.
          </p>

          <div className="max-w-xs mx-auto py-6 border border-gray-900 bg-gray-950 rounded-xl">
            <p className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider mb-1">
              Final Accuracy Score
            </p>
            <p className="text-4xl font-extrabold font-mono text-indigo-400">
              {score} <span className="text-gray-600">/</span> {filteredQuestions.length}
            </p>
            <p className="text-xs text-gray-500 mt-2 font-semibold">
              ({Math.round((score / filteredQuestions.length) * 100)}% Proficiency)
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Quiz</span>
          </button>
        </div>
      ) : (
        /* Question Active Card */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wider">
              {filteredQuestions[currentIdx].category}
            </span>
            <span className="text-gray-500 font-mono">
              Question {currentIdx + 1} of {filteredQuestions.length}
            </span>
          </div>

          <div className="p-6 border border-gray-900 bg-gray-950/40 rounded-xl space-y-5">
            <h3 className="text-sm lg:text-base font-bold text-gray-100 leading-relaxed">
              {filteredQuestions[currentIdx].question}
            </h3>

            {/* Options list */}
            <div className="grid grid-cols-1 gap-3">
              {filteredQuestions[currentIdx].options.map((opt, oIdx) => {
                const isSelected = selectedOpt === oIdx;
                const isCorrect = oIdx === filteredQuestions[currentIdx].correctIndex;

                let optionStyle = "border-gray-900 bg-gray-950/40 text-gray-300 hover:border-gray-800 hover:bg-gray-900/20";
                
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-500/5 text-emerald-400 font-semibold";
                  } else if (isSelected) {
                    optionStyle = "border-rose-500 bg-rose-500/5 text-rose-400 font-semibold";
                  } else {
                    optionStyle = "border-gray-950 bg-gray-950/10 text-gray-600 opacity-60";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionClick(oIdx)}
                    disabled={isAnswered}
                    className={`flex items-center gap-3 w-full p-4 border rounded-xl text-xs text-left transition-all ${optionStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-gray-500">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    
                    {isAnswered && isCorrect && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation panel below */}
          {isAnswered && (
            <div className="p-5 border border-indigo-950 bg-indigo-950/10 rounded-xl space-y-2.5 animate-fade-in">
              <div className="flex items-center gap-2 text-indigo-400">
                <BookOpen className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Concept Explanation</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {filteredQuestions[currentIdx].explanation}
              </p>
              
              <button
                onClick={handleNext}
                className="mt-2 ml-auto flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors"
              >
                <span>{currentIdx + 1 === filteredQuestions.length ? "Finish Quiz" : "Next Question"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
