import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { allTopics } from "@/data";
import { Terminal, Zap, Trophy, Shield, ChevronRight, BookOpen, Cpu, GraduationCap, Swords, FileText } from "lucide-react";

const ADMIN_NAME = "admindeptrai";

type Mode = "exam" | "practice";

export default function HomePage() {
  const [, navigate] = useLocation();
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("playerName") || "");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [step, setStep] = useState<"name" | "topic" | "mode">("name");
  const [typedText, setTypedText] = useState("");

  const greeting = `> Chào mừng đến với Trắc Nghiệm Mạng Máy Tính`;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < greeting.length) {
        setTypedText(greeting.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 32);
    return () => clearInterval(timer);
  }, []);

  const handleNameSubmit = () => {
    if (!playerName.trim()) return;
    localStorage.setItem("playerName", playerName.trim());
    if (playerName.trim() === ADMIN_NAME) {
      navigate("/admin");
      return;
    }
    setStep("topic");
  };

  const handleTopicNext = () => {
    if (!selectedTopic) return;
    setStep("mode");
  };

  const handleStartQuiz = () => {
    if (!selectedTopic || !selectedMode) return;
    navigate(`/quiz/${selectedTopic}/${selectedMode}`);
  };

  const handleStartMockExam = () => {
    navigate("/quiz/mock/exam");
  };

  const topicIcons = ["🌐", "📡", "🔀", "⚡", "📊", "🔐"];
  const topicColors = [
    "var(--quiz-blue)",
    "var(--quiz-cyan)",
    "var(--quiz-purple)",
    "var(--quiz-yellow)",
    "var(--quiz-green)",
    "var(--quiz-red)",
  ];

  const selectedTopicObj = allTopics.find(t => t.id === selectedTopic);
  const topicIdx = allTopics.findIndex(t => t.id === selectedTopic);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "var(--quiz-bg)" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(56,139,253,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,139,253,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="p-3 rounded-xl"
              style={{ background: "rgba(56,139,253,0.12)", border: "1px solid rgba(56,139,253,0.3)" }}
            >
              <Cpu size={28} style={{ color: "var(--quiz-blue)" }} />
            </div>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: "linear-gradient(135deg, var(--quiz-text) 0%, var(--quiz-blue) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Mạng Máy Tính
          </h1>
          <p style={{ color: "var(--quiz-muted)", fontSize: "0.875rem" }}>
            Hệ thống trắc nghiệm · 415 câu hỏi · 6 chủ đề
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="quiz-card mb-6 overflow-hidden"
        >
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#ff5f57" }} />
            <div className="terminal-dot" style={{ background: "#ffbd2e" }} />
            <div className="terminal-dot" style={{ background: "#28c840" }} />
            <span style={{ color: "var(--quiz-muted)", fontSize: "0.75rem", marginLeft: 8 }}>
              quiz-system v2.0 — bash
            </span>
          </div>
          <div className="p-5">
            <p style={{ color: "var(--quiz-green)", fontFamily: "monospace", fontSize: "0.875rem" }}>
              {typedText}
              {typedText.length < greeting.length && (
                <span style={{ animation: "blink 1s step-end infinite", color: "var(--quiz-blue)" }}>▋</span>
              )}
            </p>
            {typedText.length >= greeting.length && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ color: "var(--quiz-muted)", fontSize: "0.8rem", marginTop: 6 }}
              >
                $ Thi thật: toàn bộ câu hỏi đảo ngẫu nhiên · Luyện tập: xem đáp án từng câu
              </motion.p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="quiz-card p-6"
        >
          <AnimatePresence mode="wait">
            {step === "name" && (
              <motion.div
                key="name-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Terminal size={18} style={{ color: "var(--quiz-blue)" }} />
                  <h2 className="text-lg font-semibold">Nhập tên của bạn</h2>
                </div>
                <div className="mb-2" style={{ color: "var(--quiz-muted)", fontSize: "0.78rem" }}>
                  <span style={{ color: "var(--quiz-blue)" }}>$</span> player_name =
                </div>
                <input
                  className="quiz-input mb-5"
                  type="text"
                  placeholder="Nhập tên hiển thị..."
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleNameSubmit()}
                  autoFocus
                  maxLength={30}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button
                      className="quiz-btn quiz-btn-secondary"
                      style={{ fontSize: "0.82rem", padding: "7px 14px" }}
                      onClick={() => navigate("/leaderboard")}
                    >
                      <Trophy size={15} />
                      Bảng xếp hạng
                    </button>
                  </div>
                  <button
                    className="quiz-btn quiz-btn-primary"
                    onClick={handleNameSubmit}
                    disabled={!playerName.trim()}
                  >
                    Tiếp tục
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "topic" && (
              <motion.div
                key="topic-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={18} style={{ color: "var(--quiz-blue)" }} />
                  <h2 className="text-lg font-semibold">Chọn chủ đề</h2>
                </div>
                <p style={{ color: "var(--quiz-muted)", fontSize: "0.82rem", marginBottom: 16 }}>
                  Xin chào,{" "}
                  <span style={{ color: "var(--quiz-yellow)", fontWeight: 600 }}>{playerName}</span>!
                  Hãy chọn chủ đề để bắt đầu.
                </p>

                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  onClick={handleStartMockExam}
                  className="w-full quiz-card-2 text-left mb-4"
                  style={{
                    padding: "16px 18px",
                    cursor: "pointer",
                    border: "2px solid rgba(249,115,22,0.5)",
                    background: "rgba(249,115,22,0.07)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <FileText size={26} style={{ color: "#f97316", flexShrink: 0 }} />
                  <div className="flex-1">
                    <div className="font-bold mb-0.5" style={{ color: "#f97316", fontSize: "0.95rem" }}>
                      🎯 Thi theo đề thật — 40 câu
                    </div>
                    <div style={{ color: "var(--quiz-muted)", fontSize: "0.75rem", lineHeight: 1.4 }}>
                      Đề tổng hợp theo tỷ lệ chuẩn: Chủ đề 2 (16 câu) · CĐ 3 (8 câu) · CĐ 1&amp;5 (5 câu) · CĐ 4 (4 câu) · CĐ 6 (2 câu)
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: "#f97316", flexShrink: 0 }} />
                </motion.button>

                <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                  {allTopics.map((topic, i) => (
                    <motion.button
                      key={topic.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setSelectedTopic(topic.id)}
                      className="quiz-card-2 text-left"
                      style={{
                        padding: "14px 16px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: `1px solid ${selectedTopic === topic.id ? topicColors[i] : "var(--quiz-border)"}`,
                        background: selectedTopic === topic.id ? `${topicColors[i]}14` : "var(--quiz-card-2)",
                        borderRadius: 8,
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-3">
                        <span style={{ fontSize: 22 }}>{topicIcons[i]}</span>
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-semibold text-sm mb-0.5 truncate"
                            style={{ color: selectedTopic === topic.id ? topicColors[i] : "var(--quiz-text)" }}
                          >
                            {topic.name}
                          </div>
                          <div style={{ color: "var(--quiz-muted)", fontSize: "0.75rem", lineHeight: 1.4 }}>
                            {topic.description}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className="quiz-tag"
                              style={{
                                color: topicColors[i],
                                borderColor: `${topicColors[i]}40`,
                                background: `${topicColors[i]}10`,
                                fontSize: "0.7rem",
                              }}
                            >
                              {topic.totalQuestions} câu
                            </span>
                          </div>
                        </div>
                        {selectedTopic === topic.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ color: topicColors[i], flexShrink: 0 }}
                          >
                            <Zap size={18} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="quiz-btn quiz-btn-secondary"
                    onClick={() => setStep("name")}
                  >
                    ← Quay lại
                  </button>
                  <button
                    className="quiz-btn quiz-btn-primary"
                    onClick={handleTopicNext}
                    disabled={!selectedTopic}
                  >
                    Tiếp tục
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "mode" && selectedTopicObj && (
              <motion.div
                key="mode-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} style={{ color: "var(--quiz-blue)" }} />
                  <h2 className="text-lg font-semibold">Chọn chế độ</h2>
                </div>
                <p style={{ color: "var(--quiz-muted)", fontSize: "0.82rem", marginBottom: 20 }}>
                  Chủ đề:{" "}
                  <span style={{ color: topicColors[topicIdx], fontWeight: 600 }}>
                    {topicIcons[topicIdx]} {selectedTopicObj.name}
                  </span>
                  {" "}·{" "}
                  <span style={{ color: "var(--quiz-yellow)" }}>
                    {selectedTopicObj.questions.filter(q => q.answer !== null).length} câu
                  </span>
                </p>

                <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <motion.button
                    onClick={() => setSelectedMode("exam")}
                    className="quiz-card-2 text-left"
                    style={{
                      padding: "20px 16px",
                      cursor: "pointer",
                      border: `2px solid ${selectedMode === "exam" ? "var(--quiz-blue)" : "var(--quiz-border)"}`,
                      background: selectedMode === "exam" ? "rgba(56,139,253,0.08)" : "var(--quiz-card-2)",
                      borderRadius: 10,
                      transition: "all 0.2s",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Swords size={28} style={{ color: "var(--quiz-blue)", marginBottom: 10 }} />
                    <div className="font-bold mb-1" style={{ color: selectedMode === "exam" ? "var(--quiz-blue)" : "var(--quiz-text)" }}>
                      Thi thật
                    </div>
                    <div style={{ color: "var(--quiz-muted)", fontSize: "0.75rem", lineHeight: 1.5 }}>
                      Toàn bộ {selectedTopicObj.questions.filter(q => q.answer !== null).length} câu đảo ngẫu nhiên.
                      Nộp bài để xem điểm và lưu bảng xếp hạng.
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => setSelectedMode("practice")}
                    className="quiz-card-2 text-left"
                    style={{
                      padding: "20px 16px",
                      cursor: "pointer",
                      border: `2px solid ${selectedMode === "practice" ? "var(--quiz-green)" : "var(--quiz-border)"}`,
                      background: selectedMode === "practice" ? "rgba(63,185,80,0.08)" : "var(--quiz-card-2)",
                      borderRadius: 10,
                      transition: "all 0.2s",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GraduationCap size={28} style={{ color: "var(--quiz-green)", marginBottom: 10 }} />
                    <div className="font-bold mb-1" style={{ color: selectedMode === "practice" ? "var(--quiz-green)" : "var(--quiz-text)" }}>
                      Luyện tập
                    </div>
                    <div style={{ color: "var(--quiz-muted)", fontSize: "0.75rem", lineHeight: 1.5 }}>
                      Xem đáp án đúng/sai ngay sau mỗi câu. Không lưu điểm vào bảng xếp hạng.
                    </div>
                  </motion.button>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="quiz-btn quiz-btn-secondary"
                    onClick={() => setStep("topic")}
                  >
                    ← Quay lại
                  </button>
                  <button
                    className="quiz-btn quiz-btn-primary"
                    onClick={handleStartQuiz}
                    disabled={!selectedMode}
                  >
                    <Zap size={16} />
                    Bắt đầu
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 flex items-center justify-center gap-4"
          style={{ color: "var(--quiz-muted)", fontSize: "0.75rem" }}
        >
          <button
            onClick={() => navigate("/leaderboard")}
            style={{ background: "none", border: "none", color: "var(--quiz-muted)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4 }}
          >
            <Trophy size={13} /> Bảng xếp hạng
          </button>
        </motion.div>
      </div>
    </div>
  );
}
