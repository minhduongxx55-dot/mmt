import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { allTopics, getTopicById } from "@/data";
import type { Question } from "@/data";
import { useGetQuestionOverrides, useUpdateQuestion, useDeleteQuestionOverride } from "@workspace/api-client-react";
import { Shield, ArrowLeft, Edit3, Search, Save, X, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

const ADMIN_NAME = "admindeptrai";

export default function AdminPage() {
  const [, navigate] = useLocation();
  const playerName = localStorage.getItem("playerName") || "";

  useEffect(() => {
    if (playerName !== ADMIN_NAME) navigate("/");
  }, []);

  const [selectedTopic, setSelectedTopic] = useState(allTopics[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingQ, setEditingQ] = useState<Question | null>(null);
  const [editForm, setEditForm] = useState({ question: "", A: "", B: "", C: "", D: "", answer: "A" });
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const { data: overrides, refetch: refetchOverrides } = useGetQuestionOverrides();
  const updateQuestion = useUpdateQuestion();
  const deleteOverride = useDeleteQuestionOverride();

  const topic = getTopicById(selectedTopic);
  if (!topic || playerName !== ADMIN_NAME) return null;

  const overrideMap: Record<number, typeof overrides extends (infer T)[] | undefined ? T : never> = {};
  overrides?.filter(o => o.topicId === selectedTopic).forEach(o => {
    overrideMap[o.questionId] = o;
  });

  const questions = topic.questions.map(q => {
    const ov = overrideMap[q.id];
    if (!ov) return q;
    return { ...q, question: ov.questionText, options: { A: ov.optionA, B: ov.optionB, C: ov.optionC, D: ov.optionD }, answer: ov.answer as 'A'|'B'|'C'|'D' };
  });

  const filtered = questions.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    Object.values(q.options).some(o => o.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startEdit = (q: Question) => {
    setEditingQ(q);
    setEditForm({ question: q.question, A: q.options.A, B: q.options.B, C: q.options.C, D: q.options.D, answer: q.answer || "A" });
  };

  const handleSave = () => {
    if (!editingQ) return;
    updateQuestion.mutate({
      topicId: selectedTopic,
      questionId: editingQ.id,
      data: {
        questionText: editForm.question,
        optionA: editForm.A,
        optionB: editForm.B,
        optionC: editForm.C,
        optionD: editForm.D,
        answer: editForm.answer,
      },
    }, {
      onSuccess: () => { refetchOverrides(); setEditingQ(null); },
    });
  };

  const handleDeleteOverride = (q: Question) => {
    deleteOverride.mutate({ topicId: selectedTopic, questionId: q.id }, {
      onSuccess: () => refetchOverrides(),
    });
  };

  const overridesForTopic = overrides?.filter(o => o.topicId === selectedTopic) || [];

  return (
    <div className="min-h-screen" style={{ background: "var(--quiz-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button className="quiz-btn quiz-btn-secondary" style={{ padding: "8px 14px" }} onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Shield size={20} style={{ color: "var(--quiz-purple)" }} />
              Admin Panel
            </h1>
            <p style={{ color: "var(--quiz-muted)", fontSize: "0.8rem" }}>
              Quản lý câu hỏi · {overrides?.length || 0} câu đã chỉnh sửa
            </p>
          </div>
          <div
            className="quiz-tag"
            style={{ color: "var(--quiz-purple)", borderColor: "rgba(163,113,247,0.4)", background: "rgba(163,113,247,0.1)" }}
          >
            <Shield size={11} /> Admin
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="quiz-card-2 p-4 mb-6 flex items-start gap-3"
          style={{ borderColor: "rgba(210,153,34,0.4)", background: "rgba(210,153,34,0.06)" }}
        >
          <AlertTriangle size={16} style={{ color: "var(--quiz-yellow)", flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: "var(--quiz-muted)", fontSize: "0.8rem" }}>
            Các thay đổi sẽ ảnh hưởng đến tất cả người dùng. Chỉ chỉnh sửa khi cần thiết.
          </p>
        </motion.div>

        {/* Topic selector */}
        <div className="flex gap-2 flex-wrap mb-6">
          {allTopics.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className="quiz-btn"
              style={{
                fontSize: "0.78rem",
                padding: "6px 14px",
                background: selectedTopic === t.id ? "rgba(163,113,247,0.15)" : "transparent",
                borderColor: selectedTopic === t.id ? "var(--quiz-purple)" : "var(--quiz-border)",
                color: selectedTopic === t.id ? "var(--quiz-purple)" : "var(--quiz-muted)",
              }}
            >
              {t.name.split("–")[0].trim()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--quiz-muted)" }} />
          <input
            className="quiz-input"
            style={{ paddingLeft: 40 }}
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4" style={{ fontSize: "0.8rem", color: "var(--quiz-muted)" }}>
          <span><span style={{ color: "var(--quiz-text)", fontWeight: 600 }}>{filtered.length}</span> câu hiển thị</span>
          <span><span style={{ color: "var(--quiz-yellow)", fontWeight: 600 }}>{overridesForTopic.length}</span> câu đã chỉnh sửa</span>
        </div>

        {/* Questions list */}
        <div className="flex flex-col gap-2">
          {filtered.map((q, i) => {
            const hasOverride = !!overrideMap[q.id];
            const isExpanded = expandedQ === q.id;

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="quiz-card overflow-hidden"
                style={{ borderColor: hasOverride ? "rgba(163,113,247,0.4)" : undefined }}
              >
                <div className="flex items-start gap-3 p-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded font-mono text-xs font-bold"
                    style={{
                      width: 30, height: 30,
                      background: hasOverride ? "rgba(163,113,247,0.15)" : "var(--quiz-card-2)",
                      border: `1px solid ${hasOverride ? "var(--quiz-purple)" : "var(--quiz-border)"}`,
                      color: hasOverride ? "var(--quiz-purple)" : "var(--quiz-muted)",
                    }}
                  >
                    {q.id}
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => setExpandedQ(isExpanded ? null : q.id)} style={{ cursor: "pointer" }}>
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.5 }} className="line-clamp-2">
                      {q.question}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="quiz-tag"
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--quiz-green)",
                          borderColor: "rgba(63,185,80,0.3)",
                          background: "rgba(63,185,80,0.08)",
                        }}
                      >
                        Đáp án: {q.answer || "?"}
                      </span>
                      {hasOverride && (
                        <span
                          className="quiz-tag"
                          style={{ fontSize: "0.65rem", color: "var(--quiz-purple)", borderColor: "rgba(163,113,247,0.3)", background: "rgba(163,113,247,0.08)" }}
                        >
                          Đã sửa
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      className="quiz-btn quiz-btn-secondary"
                      style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                      onClick={() => startEdit(q)}
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={13} />
                    </button>
                    {hasOverride && (
                      <button
                        className="quiz-btn quiz-btn-danger"
                        style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                        onClick={() => handleDeleteOverride(q)}
                        title="Khôi phục mặc định"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--quiz-muted)", padding: 5 }}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden", borderTop: "1px solid var(--quiz-border)" }}
                    >
                      <div className="p-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {(["A", "B", "C", "D"] as const).map(k => (
                          <div
                            key={k}
                            className="flex items-start gap-2 p-2 rounded"
                            style={{
                              background: k === q.answer ? "rgba(63,185,80,0.08)" : "rgba(255,255,255,0.02)",
                              border: `1px solid ${k === q.answer ? "rgba(63,185,80,0.3)" : "var(--quiz-border)"}`,
                              fontSize: "0.8rem",
                            }}
                          >
                            <span
                              className="flex-shrink-0 flex items-center justify-center rounded font-bold"
                              style={{
                                width: 20, height: 20, fontSize: "0.7rem",
                                background: k === q.answer ? "var(--quiz-green)" : "var(--quiz-card)",
                                color: k === q.answer ? "#fff" : "var(--quiz-muted)",
                              }}
                            >
                              {k}
                            </span>
                            <span style={{ color: k === q.answer ? "var(--quiz-text)" : "var(--quiz-muted)" }}>
                              {q.options[k]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editingQ && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="quiz-card p-6 w-full max-w-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-5">
                <Edit3 size={18} style={{ color: "var(--quiz-purple)" }} />
                <h3 className="font-bold text-base">Chỉnh sửa Câu {editingQ.id}</h3>
                <button
                  className="ml-auto"
                  onClick={() => setEditingQ(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--quiz-muted)" }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: "0.78rem", color: "var(--quiz-muted)", display: "block", marginBottom: 6 }}>
                  Câu hỏi
                </label>
                <textarea
                  className="quiz-input"
                  style={{ minHeight: 80, resize: "vertical" }}
                  value={editForm.question}
                  onChange={e => setEditForm(f => ({ ...f, question: e.target.value }))}
                />
              </div>

              {(["A", "B", "C", "D"] as const).map(k => (
                <div key={k} className="mb-3">
                  <label style={{ fontSize: "0.78rem", color: "var(--quiz-muted)", display: "block", marginBottom: 4 }}>
                    Đáp án {k}
                  </label>
                  <input
                    className="quiz-input"
                    value={editForm[k]}
                    onChange={e => setEditForm(f => ({ ...f, [k]: e.target.value }))}
                  />
                </div>
              ))}

              <div className="mb-5">
                <label style={{ fontSize: "0.78rem", color: "var(--quiz-muted)", display: "block", marginBottom: 6 }}>
                  Đáp án đúng
                </label>
                <div className="flex gap-2">
                  {(["A", "B", "C", "D"] as const).map(k => (
                    <button
                      key={k}
                      onClick={() => setEditForm(f => ({ ...f, answer: k }))}
                      className="quiz-btn"
                      style={{
                        padding: "8px 20px",
                        background: editForm.answer === k ? "var(--quiz-green)" : "transparent",
                        borderColor: editForm.answer === k ? "var(--quiz-green)" : "var(--quiz-border)",
                        color: editForm.answer === k ? "#fff" : "var(--quiz-muted)",
                        fontWeight: 700,
                      }}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button className="quiz-btn quiz-btn-secondary" onClick={() => setEditingQ(null)}>
                  Hủy
                </button>
                <button
                  className="quiz-btn quiz-btn-primary"
                  onClick={handleSave}
                  disabled={updateQuestion.isPending}
                >
                  <Save size={14} />
                  {updateQuestion.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
