# CPU Scheduling Simulator & Viva Guide

An interactive full-stack learning platform designed for master-level operating system (OS) laboratory coursework. The application allows users to design process scenarios, dynamically simulate FCFS, SJF (Preemptive & Non-preemptive), and Priority algorithms, visualize CPU schedules with precise Gantt Charts, analyze stats using Recharts histograms, take practice quizzes, and study from an interactive Viva Questions and Answers deck.

---

## 📁 Project Folder Structure

```text
CPU-Scheduling/
├── data/
│   ├── questions.json       # JSON Database for OS Viva & Interview Questions
│   └── notes.json           # Editable dynamic notes for supported CPU algorithms
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx      # Multi-view Sidebar & mobile Hamburger navigation
│   │   ├── GanttChart.tsx   # Custom color-coded Gantt execution chart component
│   │   ├── BarCharts.tsx    # Comparative Turnaround/Wait time Recharts panel
│   │   └── Toast.tsx        # Self-contained VS Code-style alerts system
│   ├── pages/
│   │   ├── Home.tsx         # Dashboard Hero Banner & platform key stats
│   │   ├── Intro.tsx        # Educational definitions, objectives & paradigms
│   │   ├── AlgorithmDetail.tsx # Unified Simulator workspace (FCFS, SJF, Priority)
│   │   ├── Quiz.tsx         # Stateful multi-category MCQs section
│   │   ├── VivaGuide.tsx    # Scrollable viva deck with index-linking & highlights
│   │   ├── AdminDashboard.tsx # Admin unlock panel, DB editors, and notes config
│   │   └── About.tsx        # Mathematical formulae sheets and contacts
│   ├── types.ts             # Shared type-safe TypeScript interfaces
│   ├── scheduling_engine.ts # core mathematical dispatch simulation solvers
│   ├── main.tsx             # Application client-side entry point
│   └── index.css            # Tailored Tailwind themes and printing overrides
├── server.ts                # Express backend routing with Vite middleware wrapper
├── package.json             # Scripts, Node server, and client package definitions
├── vite.config.ts           # Bundler aliases and disabled HMR triggers
└── tsconfig.json            # Strict path and ESNext module guidelines
```

---

## 🚀 Installation & Local Startup

Ensure you have [Node.js (v18+)](https://nodejs.org/) installed.

1. **Clone or Extract the Workspace**:
   Open a terminal in the root directory.

2. **Install Node Packages**:
   ```bash
   npm install
   ```

3. **Start the Integrated Dev Server**:
   ```bash
   npm run dev
   ```
   *Note: This starts the single-port Express server in development mode. The app will be available immediately at [http://localhost:3000](http://localhost:3000).*

4. **Verify Type-Safety & Code Style**:
   ```bash
   npm run lint
   ```

---

## 🌐 API Documentation

All solvers and catalogs are powered by our backend REST APIs:

### ⏱️ CPU Dispatch Simulators

#### 1. FCFS Solver
* **Endpoint**: `POST /api/fcfs`
* **Payload**: `{ "processes": [{ "id": "P1", "arrivalTime": 0, "burstTime": 10 }] }`
* **Response**: Returns JSON with evaluated starting, completion, wait, turnaround, and response times alongside Gantt block sequences.

#### 2. SJF (Preemptive/Non-preemptive SRTF) Solver
* **Endpoint**: `POST /api/sjf`
* **Payload**: `{ "processes": [...], "preemptive": true }`
* **Response**: Returns optimally simulated sequence.

#### 3. Priority Solver
* **Endpoint**: `POST /api/priority`
* **Payload**: `{ "processes": [...], "preemptive": false, "lowerIsHigher": true }`
* **Response**: Order-based scheduler output.

---

### 📖 Syllabus Questions & Notes

#### 1. Fetch Viva Library
* **Endpoint**: `GET /api/questions`
* **Response**: Full list of viva cards.

#### 2. Add New Question (Admin)
* **Endpoint**: `POST /api/questions`
* **Payload**: Complete question metadata.

#### 3. Update Question (Admin)
* **Endpoint**: `PUT /api/questions/:id`

#### 4. Delete Question (Admin)
* **Endpoint**: `DELETE /api/questions/:id`

---

## 📦 Production Compiling & Deployment

To bundle the application into a highly efficient, single standalone Node process (perfect for Cloud Run, Docker containers, or VPS):

1. **Compile both Client and Server**:
   ```bash
   npm run build
   ```
   This will:
   * Build your React client static pages into the `/dist` folder.
   * Bundle your Express `server.ts` into a lightweight, self-contained, high-speed CommonJS package at `/dist/server.cjs` using `esbuild`.

2. **Boot the Production Server**:
   ```bash
   npm start
   ```
   This directly executes `node dist/server.cjs`, serving your compiled React app and API endpoints on port `3000` with near-zero cold-starts.
