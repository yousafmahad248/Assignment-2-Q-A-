import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { runFCFS, runSJF, runPriority, Process } from "./src/scheduling_engine";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  // Helper file paths
  const questionsPath = path.join(process.cwd(), "data", "questions.json");
  const notesPath = path.join(process.cwd(), "data", "notes.json");

  // Helper function to read/write JSON safely
  function readJsonFile(filePath: string, defaultVal: any) {
    try {
      if (!fs.existsSync(filePath)) {
        // Ensure parent directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), "utf-8");
        return defaultVal;
      }
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e);
      return defaultVal;
    }
  }

  function writeJsonFile(filePath: string, data: any) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error(`Error writing ${filePath}:`, e);
      return false;
    }
  }

  // ==========================================
  // CPU SCHEDULING SOLVER ENDPOINTS
  // ==========================================

  app.post("/api/fcfs", (req, res) => {
    try {
      const { processes } = req.body;
      if (!processes || !Array.isArray(processes)) {
        return res.status(400).json({ error: "Invalid processes payload" });
      }
      const typedProcesses = processes.map((p: any) => ({
        id: String(p.id),
        arrivalTime: Number(p.arrivalTime),
        burstTime: Number(p.burstTime),
        priority: Number(p.priority || 0),
      }));

      const result = runFCFS(typedProcesses);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/sjf", (req, res) => {
    try {
      const { processes, preemptive } = req.body;
      if (!processes || !Array.isArray(processes)) {
        return res.status(400).json({ error: "Invalid processes payload" });
      }
      const typedProcesses = processes.map((p: any) => ({
        id: String(p.id),
        arrivalTime: Number(p.arrivalTime),
        burstTime: Number(p.burstTime),
        priority: Number(p.priority || 0),
      }));

      const result = runSJF(typedProcesses, !!preemptive);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/priority", (req, res) => {
    try {
      const { processes, preemptive, lowerIsHigher } = req.body;
      if (!processes || !Array.isArray(processes)) {
        return res.status(400).json({ error: "Invalid processes payload" });
      }
      const typedProcesses = processes.map((p: any) => ({
        id: String(p.id),
        arrivalTime: Number(p.arrivalTime),
        burstTime: Number(p.burstTime),
        priority: Number(p.priority || 0),
      }));

      const result = runPriority(typedProcesses, !!preemptive, lowerIsHigher !== false);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // VIVA / INTERVIEW QUESTIONS API
  // ==========================================

  app.get("/api/questions", (req, res) => {
    const questions = readJsonFile(questionsPath, []);
    res.json(questions);
  });

  app.post("/api/questions", (req, res) => {
    const { title, question, answer, example, importantPoints, category } = req.body;
    if (!title || !question || !answer) {
      return res.status(400).json({ error: "Missing required fields (title, question, answer)" });
    }

    const questions = readJsonFile(questionsPath, []);
    const newQuestion = {
      id: String(Date.now()),
      title,
      question,
      answer,
      example: example || "",
      importantPoints: Array.isArray(importantPoints) ? importantPoints : [],
      category: category || "General",
    };

    questions.push(newQuestion);
    writeJsonFile(questionsPath, questions);
    res.status(201).json(newQuestion);
  });

  app.put("/api/questions/:id", (req, res) => {
    const { id } = req.params;
    const { title, question, answer, example, importantPoints, category } = req.body;

    const questions = readJsonFile(questionsPath, []);
    const index = questions.findIndex((q: any) => q.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Question not found" });
    }

    questions[index] = {
      ...questions[index],
      title: title || questions[index].title,
      question: question || questions[index].question,
      answer: answer || questions[index].answer,
      example: example !== undefined ? example : questions[index].example,
      importantPoints: Array.isArray(importantPoints) ? importantPoints : questions[index].importantPoints,
      category: category || questions[index].category,
    };

    writeJsonFile(questionsPath, questions);
    res.json(questions[index]);
  });

  app.delete("/api/questions/:id", (req, res) => {
    const { id } = req.params;
    const questions = readJsonFile(questionsPath, []);
    const filtered = questions.filter((q: any) => q.id !== id);

    if (filtered.length === questions.length) {
      return res.status(404).json({ error: "Question not found" });
    }

    writeJsonFile(questionsPath, filtered);
    res.json({ success: true, message: "Question deleted successfully" });
  });

  // ==========================================
  // ALGORITHM NOTES API
  // ==========================================

  app.get("/api/notes", (req, res) => {
    const notes = readJsonFile(notesPath, []);
    res.json(notes);
  });

  app.put("/api/notes/:id", (req, res) => {
    const { id } = req.params;
    const { introduction, working, advantages, disadvantages, timeComplexity, useCases, realLifeExample } = req.body;

    const notes = readJsonFile(notesPath, []);
    const index = notes.findIndex((n: any) => n.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Algorithm notes not found" });
    }

    notes[index] = {
      ...notes[index],
      introduction: introduction || notes[index].introduction,
      working: working || notes[index].working,
      advantages: advantages || notes[index].advantages,
      disadvantages: disadvantages || notes[index].disadvantages,
      timeComplexity: timeComplexity || notes[index].timeComplexity,
      useCases: useCases || notes[index].useCases,
      realLifeExample: realLifeExample || notes[index].realLifeExample,
    };

    writeJsonFile(notesPath, notes);
    res.json(notes[index]);
  });

  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    // Simple secure check for demo purposes
    if (username === "admin" && password === "admin123") {
      res.json({
        success: true,
        token: "admin-jwt-token-cpu-scheduling-simulator-viva-guide",
        username: "admin",
      });
    } else {
      res.status(401).json({ error: "Invalid administrator credentials" });
    }
  });

  // ==========================================
  // VITE SERVICE MOUNTING / SPA ROUTING
  // ==========================================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running CPU Scheduling simulator server on port ${PORT}`);
  });
}

startServer();
