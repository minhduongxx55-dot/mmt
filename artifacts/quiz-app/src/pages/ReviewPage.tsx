import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/data";
import { allTopics } from "@/data";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, X, Filter, Home } from "lucide-react";

interface ReviewState {
  playerName: string;
  topicId: string;
  topicName: string;
  questions: Question[];
  answers: Record<number, string>;
  score: number;
  correctAnswers: number;
  mode?: "exam" | "practice";
}

const OPTION_KEYS: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

const TOPIC_COLORS: Record<string, string> = {
  topic1: "var(--quiz-blue)",
  topic2: "var(--quiz-cyan)",
  topic3: "var(--quiz-purple)",
  topic4: "var(--quiz-yellow)",
  topic5: "var(--quiz-green)",
  topic6: "var(--quiz-red)",
  mock: "#f97316",
};

function getOptionStyle(key: string, answer: string | null, userAns: string | undefined) {
  const isAnswer = key === answer;
  const isWrong = key === userAns && !isAnswer;
  if (isAnswer) return {
    border: "1px solid var(--quiz-green)",
    background: "rgba(63,185,80,0.08)",
    textColor: "var(--quiz-text)",
    keyBg: "var(--quiz-green)",
    keyColor: "#fff",
  };
  if (isWrong) return {
    border: "1px solid var(--quiz-red)",
    background: "rgba(248,81,73,0.08)",
    textColor: "var(--quiz-text)",
    keyBg: "var(--quiz-red)",
    keyColor: "#fff",
  };
  return {
    border: "1px solid var(--quiz-border)",
    background: "transparent",
    textColor: "var(--quiz-muted)",
    keyBg: "var(--quiz-card)",
    keyColor: "var(--quiz-muted)",
  };
}

export default function ReviewPage() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<ReviewState | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showWrongOnly, setShowWrongOnly] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("quizReview");
    if (raw) setState(JSON.parse(raw));
    else navigate("/");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setCurrentIdx(i => Math.min(displayQuestions.length - 1, i + 1));
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") setCurrentIdx(i => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!state) return null;

  const { questions, answers, topicName } = state;

  const wrongQuestions = questions.filter(q => answers[q.id] !== q.answer);
  const displayQuestions = showWrongOnly ? wrongQuestions : questions;
  const safeIdx = Math.min(currentIdx, Math.max(0, displayQuestions.length - 1));
  const currentQ = displayQuestions[safeIdx];
  const userAns = currentQ ? answers[currentQ.id] : undefined;
  const isCorrect = userAns === currentQ?.answer;

  const handleFilterToggle = () => {
    setShowWrongOnly(v => !v);
    setCurrentIdx(0);
  };

  const qTopicId = currentQ?.topicId;
  const qTopic = qTopicId ? allTopics.find(t => t.id === qTopicId) : null;
  const topicColor = qTopic ? (TOPIC_COLORS[qTopic.id] ?? "var(--quiz-blue)") : "var(--quiz-blue)";

  if (displayQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--quiz-bg)" }}>
        <div className="quiz-card p-8 text-center max-w-sm">
          <CheckCircle size={48} style={{ color: "var(--quiz-green)", margin: "0 auto 16px" }} />
          <h2 className="text-xl font-bold mb-2">Không có câu nào sai!</h2>
          <p style={{ color: "var(--quiz-muted)", marginBottom: 24, fontSize: "0.88rem" }}>
            Bạn đã trả lời đúng tất cả {questions.length} câu hỏi. Xuất sắc! 🎉
          </p>
          <button className="quiz-btn quiz-btn-primary w-full" onClick={() => navigate("/")}>
            <Home size={15} /> Trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--quiz-bg)" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-20"
        style={{
          background: "rgba(13,17,23,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--quiz-border)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            className="quiz-btn quiz-btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.8rem", flexShrink: 0 }}
            onClick={() => navigate("/")}
            title="Về trang chủ"
          >
            <X size={14} />
          </button>

          <div className="flex-1 min-w-0">
            <div style={{ color: "var(--quiz-muted)", fontSize: "0.72rem", marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ color: "var(--quiz-blue)" }}>●</span>{" "}{topicName} — Xem lại đáp án
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Câu {safeIdx + 1}/{displayQuestions.length}
              {showWrongOnly && (
                <span style={{ color: "var(--quiz-red)", marginLeft: 8, fontSize: "0.75rem", fontWeight: 400 }}>
                  ({wrongQuestions.length} câu sai)
                </span>
              )}
            </div>
          </div>

          <button
            className="quiz-btn"
            style={{
              padding: "6px 12px",
              fontSize: "0.75rem",
              flexShrink: 0,
              borderColor: showWrongOnly ? "var(--quiz-red)" : "var(--quiz-border)",
              color: showWrongOnly ? "var(--quiz-red)" : "var(--quiz-muted)",
              background: showWrongOnly ? "rgba(248,81,73,0.1)" : "transparent",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
            onClick={handleFilterToggle}
          >
            <Filter size={13} />
            {showWrongOnly ? "Đang lọc sai" : "Lọc sai"}
          </button>
        </div>

        {/* Question grid */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex flex-wrap gap-1">
            {displayQuestions.map((q, i) => {
              const ans = answers[q.id];
              const correct = ans === q.answer;
              const noAns = !ans;
              const isActive = i === safeIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  title={`Câu ${i + 1}`}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    border: isActive ? "2px solid var(--quiz-blue)" : "1px solid transparent",
                    cursor: "pointer",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    background: isActive
                      ? "var(--quiz-blue)"
                      : noAns
                      ? "rgba(255,255,255,0.06)"
                      : correct
                      ? "var(--quiz-green)"
                      : "var(--quiz-red)",
                    color: noAns && !isActive ? "var(--quiz-muted)" : "#fff",
                    transition: "all 0.1s",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentQ.id}-${showWrongOnly}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.15 }}
          >
            {/* Topic badge (for mock exam) */}
            {qTopic && (
              <div className="mb-3">
                <span
                  className="quiz-tag"
                  style={{
                    fontSize: "0.72rem",
                    color: topicColor,
                    borderColor: `${topicColor}40`,
                    background: `${topicColor}12`,
                  }}
                >
                  {qTopic.name.split("–")[0].trim()}
                </span>
              </div>
            )}

            {/* Status banner */}
            <div
              className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
              style={{
                background: isCorrect ? "rgba(63,185,80,0.08)" : "rgba(248,81,73,0.08)",
                border: `1px solid ${isCorrect ? "rgba(63,185,80,0.25)" : "rgba(248,81,73,0.25)"}`,
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              {isCorrect ? (
                <>
                  <CheckCircle size={15} style={{ color: "var(--quiz-green)", flexShrink: 0 }} />
                  <span style={{ color: "var(--quiz-green)" }}>Trả lời đúng</span>
                </>
              ) : userAns ? (
                <>
                  <XCircle size={15} style={{ color: "var(--quiz-red)", flexShrink: 0 }} />
                  <span style={{ color: "var(--quiz-red)" }}>
                    Trả lời sai · Bạn chọn{" "}
                    <span style={{
                      background: "var(--quiz-red)",
                      color: "#fff",
                      borderRadius: 4,
                      padding: "1px 6px",
                      fontSize: "0.78rem",
                    }}>{userAns}</span>
                    {" "}· Đáp án đúng{" "}
                    <span style={{
                      background: "var(--quiz-green)",
                      color: "#fff",
                      borderRadius: 4,
                      padding: "1px 6px",
                      fontSize: "0.78rem",
                    }}>{currentQ.answer}</span>
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={15} style={{ color: "var(--quiz-muted)", flexShrink: 0 }} />
                  <span style={{ color: "var(--quiz-muted)" }}>
                    Chưa trả lời · Đáp án đúng:{" "}
                    <span style={{
                      background: "var(--quiz-green)",
                      color: "#fff",
                      borderRadius: 4,
                      padding: "1px 6px",
                      fontSize: "0.78rem",
                    }}>{currentQ.answer}</span>
                  </span>
                </>
              )}
            </div>

            {/* Question text */}
            <div
              className="quiz-card p-4 mb-4"
              style={{
                borderColor: isCorrect ? "rgba(63,185,80,0.2)" : "rgba(248,81,73,0.2)",
                fontSize: "0.95rem",
                lineHeight: 1.75,
                fontWeight: 500,
              }}
            >
              <span style={{ color: "var(--quiz-muted)", marginRight: 6, fontSize: "0.75rem", fontFamily: "monospace" }}>
                #{safeIdx + 1}
              </span>
              {currentQ.question}
            </div>

            {/* Image */}
            {currentQ.image && (
              <div className="mb-4 flex justify-center">
                <img
                  src={currentQ.image}
                  alt="Hình vẽ minh họa"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 260,
                    borderRadius: 8,
                    border: "1px solid var(--quiz-border)",
                    background: "#fff",
                    padding: 8,
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {/* Options */}
            <div className="flex flex-col gap-2">
              {OPTION_KEYS.map(key => {
                const text = currentQ.options[key];
                if (!text) return null;
                const isAnswer = key === currentQ.answer;
                const isWrong = key === userAns && !isAnswer;
                const s = getOptionStyle(key, currentQ.answer, userAns);

                return (
                  <div
                    key={key}
                    className="flex items-start gap-3 rounded-xl"
                    style={{
                      border: s.border,
                      background: s.background,
                      padding: "10px 14px",
                      transition: "all 0.1s",
                    }}
                  >
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-md font-bold"
                      style={{
                        width: 26,
                        height: 26,
                        background: s.keyBg,
                        color: s.keyColor,
                        fontSize: "0.8rem",
                        marginTop: 1,
                      }}
                    >
                      {key}
                    </span>
                    <span style={{ color: s.textColor, fontSize: "0.88rem", lineHeight: 1.55, flex: 1 }}>
                      {text}
                    </span>
                    {isAnswer && <CheckCircle size={15} style={{ color: "var(--quiz-green)", flexShrink: 0, marginTop: 4 }} />}
                    {isWrong && <XCircle size={15} style={{ color: "var(--quiz-red)", flexShrink: 0, marginTop: 4 }} />}
                  </div>
                );
              })}
            </div>

            {/* Keyboard hint */}
            <div className="mt-5 text-center" style={{ color: "var(--quiz-muted)", fontSize: "0.72rem" }}>
              Dùng phím ← → để chuyển câu
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div
        className="sticky bottom-0 z-20"
        style={{
          background: "rgba(13,17,23,0.95)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid var(--quiz-border)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            className="quiz-btn quiz-btn-secondary"
            disabled={safeIdx === 0}
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            style={{ flex: 1, opacity: safeIdx === 0 ? 0.35 : 1 }}
          >
            <ChevronLeft size={16} /> Trước
          </button>

          <div style={{ color: "var(--quiz-muted)", fontSize: "0.8rem", textAlign: "center", minWidth: 72 }}>
            {safeIdx + 1} / {displayQuestions.length}
          </div>

          <button
            className="quiz-btn quiz-btn-secondary"
            disabled={safeIdx === displayQuestions.length - 1}
            onClick={() => setCurrentIdx(i => Math.min(displayQuestions.length - 1, i + 1))}
            style={{ flex: 1, opacity: safeIdx === displayQuestions.length - 1 ? 0.35 : 1 }}
          >
            Tiếp <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
