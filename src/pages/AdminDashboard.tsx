import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Lock, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  BookOpen, 
  Cpu, 
  Layout, 
  X,
  PlusCircle,
  FolderLock
} from "lucide-react";
import { VivaQuestion, AlgorithmNotes } from "../types";
import { useToast } from "../components/Toast";

interface AdminDashboardProps {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) => {
  const { showToast } = useToast();

  // Login credentials
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Database records
  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [notesList, setNotesList] = useState<AlgorithmNotes[]>([]);
  const [loadingDb, setLoadingDb] = useState<boolean>(false);

  // Tab state within Admin: "questions" or "notes"
  const [adminTab, setAdminTab] = useState<"questions" | "notes">("questions");

  // Edit/Add states for questions
  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Partial<VivaQuestion>>({});

  // Edit states for algorithm notes
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [editingNote, setEditingNote] = useState<Partial<AlgorithmNotes>>({});

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchDatabase();
    }
  }, [isAdminLoggedIn]);

  const fetchDatabase = async () => {
    setLoadingDb(true);
    try {
      const qRes = await axios.get("/api/questions");
      const nRes = await axios.get("/api/notes");
      setQuestions(qRes.data);
      setNotesList(nRes.data);
      if (nRes.data.length > 0) {
        handleSelectNote(nRes.data[0].id, nRes.data);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load admin databases", "error");
    } finally {
      setLoadingDb(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast("Username and password are required", "error");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await axios.post("/api/auth/login", { username, password });
      if (res.data.success) {
        setIsAdminLoggedIn(true);
        showToast("Welcome Administrator. Session started.", "success");
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "Invalid administrator credentials", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    showToast("Admin session cleared", "info");
  };

  // ==========================================
  // QUESTIONS MANAGEMENT ACTIONS
  // ==========================================

  const handleEditQuestionClick = (q: VivaQuestion) => {
    setSelectedQuestion({ ...q });
    setIsEditingQuestion(true);
    setIsAddingQuestion(false);
  };

  const handleAddQuestionClick = () => {
    setSelectedQuestion({
      title: "",
      question: "",
      answer: "",
      example: "",
      importantPoints: ["", ""],
      category: "General OS"
    });
    setIsAddingQuestion(true);
    setIsEditingQuestion(false);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this viva question?")) return;
    try {
      await axios.delete(`/api/questions/${id}`);
      showToast("Question deleted from library", "success");
      fetchDatabase();
    } catch (err) {
      showToast("Failed to delete question", "error");
    }
  };

  const handleSaveQuestion = async () => {
    const { title, question, answer, example, importantPoints, category } = selectedQuestion;
    if (!title || !question || !answer) {
      showToast("Title, Question, and Answer fields are required!", "error");
      return;
    }

    // Filter out blank bullet points
    const cleanPoints = Array.isArray(importantPoints) 
      ? importantPoints.filter(p => p.trim() !== "") 
      : [];

    try {
      if (isAddingQuestion) {
        await axios.post("/api/questions", {
          title, question, answer, example, importantPoints: cleanPoints, category
        });
        showToast("New question added to index", "success");
      } else {
        await axios.put(`/api/questions/${selectedQuestion.id}`, {
          title, question, answer, example, importantPoints: cleanPoints, category
        });
        showToast("Question updated successfully", "success");
      }
      setIsAddingQuestion(false);
      setIsEditingQuestion(false);
      fetchDatabase();
    } catch (err) {
      showToast("Failed to save question", "error");
    }
  };

  // ==========================================
  // ALGORITHM NOTES MANAGEMENT ACTIONS
  // ==========================================

  const handleSelectNote = (id: string, list = notesList) => {
    setSelectedNoteId(id);
    const found = list.find(n => n.id === id);
    if (found) {
      setEditingNote({ ...found });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedNoteId) return;
    try {
      await axios.put(`/api/notes/${selectedNoteId}`, editingNote);
      showToast(`Updated notes for ${editingNote.algorithm}`, "success");
      fetchDatabase();
    } catch (err) {
      showToast("Failed to update algorithm notes", "error");
    }
  };

  // ==========================================
  // RENDER SECTIONS
  // ==========================================

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 animate-fade-in">
        <div className="bg-gray-950 border border-gray-900 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.03),transparent_50%)]"></div>
          
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
              <FolderLock className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Admin Terminal Lock</h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              Login with course administrator credentials to unlock catalog editing and question management capabilities.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="text-[10px] text-gray-500 font-semibold block mb-1">Administrator Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 font-medium"
                placeholder="e.g. admin"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-semibold block mb-1">Admin Security Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="Password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5"
              >
                {isLoggingIn ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>Authorize & Unlock</span>
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-[10px] text-gray-600 font-mono">
              Demo Credentials: <span className="text-gray-500">admin / admin123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-500" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mt-1">
            manage lab curricula, viva card decks, and notes
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900 rounded-lg transition-all"
        >
          Logout Session
        </button>
      </section>

      {/* Internal admin subtabs */}
      <div className="flex border-b border-gray-900 gap-1">
        <button
          onClick={() => setAdminTab("questions")}
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-px transition-all ${
            adminTab === "questions"
              ? "border-emerald-500 text-emerald-400 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Viva Questions Manager ({questions.length})</span>
        </button>
        <button
          onClick={() => setAdminTab("notes")}
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-px transition-all ${
            adminTab === "notes"
              ? "border-emerald-500 text-emerald-400 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Algorithm Notes Config</span>
        </button>
      </div>

      {loadingDb ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-mono">Loading records...</p>
        </div>
      ) : (
        /* Tab Contents */
        <div className="space-y-6">
          
          {/* ========================================== */}
          {/* TAB: VIVA QUESTIONS MANAGER               */}
          {/* ========================================== */}
          {adminTab === "questions" && (
            <div className="space-y-6">
              {!isEditingQuestion && !isAddingQuestion ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Registered Questions
                    </h3>
                    <button
                      onClick={handleAddQuestionClick}
                      className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Question</span>
                    </button>
                  </div>

                  <div className="border border-gray-900 rounded-xl overflow-hidden bg-gray-950/20 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-950 border-b border-gray-900 text-[10px] text-gray-500 font-mono font-bold uppercase">
                          <th className="p-3">Title</th>
                          <th className="p-3">Question</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-900 text-gray-300">
                        {questions.map((q) => (
                          <tr key={q.id} className="hover:bg-gray-900/20">
                            <td className="p-3 font-semibold text-gray-200">{q.title}</td>
                            <td className="p-3 max-w-sm truncate text-gray-400">{q.question}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-gray-950 border border-gray-900 text-[10px] text-gray-400 font-mono">
                                {q.category}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => handleEditQuestionClick(q)}
                                className="p-1 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all"
                                title="Edit Question"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-1 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                                title="Delete Question"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* Question Form Card */
                <div className="bg-gray-950/60 border border-gray-900 rounded-xl p-6 space-y-4 max-w-2xl">
                  <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                    <h3 className="text-sm font-bold text-gray-200">
                      {isAddingQuestion ? "Create New Viva Question" : `Edit Question #${selectedQuestion.id}`}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingQuestion(false);
                        setIsEditingQuestion(false);
                      }}
                      className="p-1.5 text-gray-500 hover:text-gray-300 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-gray-500 font-semibold block mb-1">Index Title</label>
                        <input
                          type="text"
                          value={selectedQuestion.title || ""}
                          onChange={(e) => setSelectedQuestion({ ...selectedQuestion, title: e.target.value })}
                          className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500"
                          placeholder="e.g. Starvation explanation"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-semibold block mb-1">Category Group</label>
                        <input
                          type="text"
                          value={selectedQuestion.category || ""}
                          onChange={(e) => setSelectedQuestion({ ...selectedQuestion, category: e.target.value })}
                          className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500"
                          placeholder="e.g. General OS, SJF, Metrics"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">The Question Text</label>
                      <textarea
                        value={selectedQuestion.question || ""}
                        onChange={(e) => setSelectedQuestion({ ...selectedQuestion, question: e.target.value })}
                        className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 h-16"
                        placeholder="Type question here..."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">Detailed Answer</label>
                      <textarea
                        value={selectedQuestion.answer || ""}
                        onChange={(e) => setSelectedQuestion({ ...selectedQuestion, answer: e.target.value })}
                        className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 h-28"
                        placeholder="Type detailed theoretical explanation..."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">Real-life Metaphor / Analogy (Optional)</label>
                      <input
                        type="text"
                        value={selectedQuestion.example || ""}
                        onChange={(e) => setSelectedQuestion({ ...selectedQuestion, example: e.target.value })}
                        className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. Like patients entering a hospital triage line..."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-2">Key Takeaways Bullets (One per line)</label>
                      <textarea
                        value={Array.isArray(selectedQuestion.importantPoints) ? selectedQuestion.importantPoints.join("\n") : ""}
                        onChange={(e) => setSelectedQuestion({ ...selectedQuestion, importantPoints: e.target.value.split("\n") })}
                        className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 h-20 font-mono"
                        placeholder="Bullet Point 1&#10;Bullet Point 2"
                      />
                    </div>

                    <button
                      onClick={handleSaveQuestion}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Question to Library</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: ALGORITHM NOTES MANAGER               */}
          {/* ========================================== */}
          {adminTab === "notes" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Note Selector Sidebar */}
              <div className="lg:col-span-1 bg-gray-950 border border-gray-900 rounded-xl p-4 space-y-2">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">
                  Select Algorithm Notes
                </h4>
                {notesList.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleSelectNote(n.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                      selectedNoteId === n.id
                        ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/10"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/40 border border-transparent"
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-gray-500" />
                    <span>{n.algorithm}</span>
                  </button>
                ))}
              </div>

              {/* Editing Form */}
              <div className="lg:col-span-3 bg-gray-950/40 border border-gray-900 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-200 border-b border-gray-900 pb-3">
                  Config Notes for: {editingNote.algorithm}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-gray-500 font-semibold block mb-1">Algorithm Introduction</label>
                    <textarea
                      value={editingNote.introduction || ""}
                      onChange={(e) => setEditingNote({ ...editingNote, introduction: e.target.value })}
                      className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 h-24 h-fit"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 font-semibold block mb-1">Algorithm Work Procedure (Flow)</label>
                    <textarea
                      value={editingNote.working || ""}
                      onChange={(e) => setEditingNote({ ...editingNote, working: e.target.value })}
                      className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 h-24 h-fit"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">Advantages (One per line)</label>
                      <textarea
                        value={editingNote.advantages || ""}
                        onChange={(e) => setEditingNote({ ...editingNote, advantages: e.target.value })}
                        className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 h-24"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">Disadvantages (One per line)</label>
                      <textarea
                        value={editingNote.disadvantages || ""}
                        onChange={(e) => setEditingNote({ ...editingNote, disadvantages: e.target.value })}
                        className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500 h-24"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">Time Complexity Specs</label>
                      <input
                        type="text"
                        value={editingNote.timeComplexity || ""}
                        onChange={(e) => setEditingNote({ ...editingNote, timeComplexity: e.target.value })}
                        className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold block mb-1">Real-life Metaphor Example</label>
                      <input
                        type="text"
                        value={editingNote.realLifeExample || ""}
                        onChange={(e) => setEditingNote({ ...editingNote, realLifeExample: e.target.value })}
                        className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 font-semibold block mb-1">Practical Use Cases</label>
                    <input
                      type="text"
                      value={editingNote.useCases || ""}
                      onChange={(e) => setEditingNote({ ...editingNote, useCases: e.target.value })}
                      className="w-full text-xs bg-gray-900 border border-gray-800 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveNotes}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Notes Configuration</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};
