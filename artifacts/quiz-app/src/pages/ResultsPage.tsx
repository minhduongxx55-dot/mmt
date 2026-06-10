import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import type { Question } from "@/data";
import { useSubmitResult } from "@workspace/api-client-react";
import { Trophy, CheckCircle, RotateCcw, Home, BookOpen } from "lucide-react";

interface ResultState {
  playerName: string;
  topicId: string;
  topicName: string;
  questions: Question[];
  answers: Record<number, string>;
  score: number;
  correctAnswers: number;
  timeElapsed: number;
  mode?: "exam" | "practice";
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<ResultState | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const submitResult = useSubmitResult();
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem("quizResult");
    if (raw) {
      setState(JSON.parse(raw));
      localStorage.removeItem("quizResult");
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (state && !hasSubmitted.current && state.mode !== "practice") {
      hasSubmitted.current = true;
      submitResult.mutate(
        {
          data: {
            playerName: state.playerName,
            topicId: state.topicId,
            topicName: state.topicName,
            score: state.score,
            totalQuestions: state.questions.length,
            correctAnswers: state.correctAnswers,
            timeElapsed: state.timeElapsed,
          },
        },
        { onSuccess: () => setSubmitted(true) }
      );
    }
  }, [state]);

  if (!state) return null;

  const { questions, answers, score, correctAnswers, timeElapsed, playerName, topicName, topicId, mode } = state;
  const isPractice = mode === "practice";
  const total = questions.length;
  const wrongAnswers = total - correctAnswers;

  const getScoreColor = () => {
    if (score >= 8) return "var(--quiz-green)";
    if (score >= 5) return "var(--quiz-yellow)";
    return "var(--quiz-red)";
  };

  const getScoreLabel = () => {
    if (score >= 9) return "Xuất sắc! 🎉";
    if (score >= 8) return "Giỏi! 🌟";
    if (score >= 6.5) return "Khá tốt! 👍";
    if (score >= 5) return "Trung bình 📚";
    return "Cần cố gắng hơn 💪";
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}p ${sec}s`;
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--quiz-bg)" }}>
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 0%, ${getScoreColor()}0d 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="quiz-card p-8 mb-6 text-center"
          style={{ borderColor: `${getScoreColor()}40` }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ color: "var(--quiz-muted)", fontSize: "0.8rem", marginBottom: 4, fontFamily: "monospace" }}>
              $ result —player "{playerName}"
            </div>
            <div style={{ color: "var(--quiz-muted)", fontSize: "0.8rem", marginBottom: 24, fontFamily: "monospace" }}>
              $ topic: {topicName}
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="score-circle mx-auto mb-4"
            style={{
              borderColor: getScoreColor(),
              boxShadow: `0 0 32px ${getScoreColor()}40`,
            }}
          >
            <div
              className="text-4xl font-bold"
              style={{ color: getScoreColor(), lineHeight: 1 }}
            >
              {score.toFixed(1)}
            </div>
            <div style={{ color: "var(--quiz-muted)", fontSize: "0.7rem" }}>/10</div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-bold mb-6"
            style={{ color: getScoreColor() }}
          >
            {getScoreLabel()}
          </motion.h2>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Đúng", value: correctAnswers, color: "var(--quiz-green)" },
              { label: "Sai", value: wrongAnswers, color: "var(--quiz-red)" },
              { label: "Tổng", value: total, color: "var(--quiz-blue)" },
              { label: "Thời gian", value: formatTime(timeElapsed), color: "var(--quiz-yellow)" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="quiz-card-2 p-3"
              >
                <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div style={{ color: "var(--quiz-muted)", fontSize: "0.72rem" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {submitted && !isPractice && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4 flex items-center justify-center gap-2"
              style={{ color: "var(--quiz-green)", fontSize: "0.8rem" }}
            >
              <CheckCircle size={14} /> Kết quả đã được lưu vào bảng xếp hạng
            </motion.div>
          )}
          {isPractice && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4 flex items-center justify-center gap-2"
              style={{ color: "var(--quiz-muted)", fontSize: "0.8rem" }}
            >
              <span style={{ fontSize: "0.75rem" }}>📚 Chế độ luyện tập — không lưu vào bảng xếp hạng</span>
            </motion.div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3 mb-6"
        >
          {/* Primary: review button */}
          <button
            className="quiz-btn quiz-btn-primary w-full"
            style={{ padding: "12px 16px", fontSize: "0.9rem" }}
            onClick={() => {
              localStorage.setItem("quizReview", JSON.stringify(state));
              navigate("/review");
            }}
          >
            <BookOpen size={16} />
            Xem lại đáp án chi tiết
          </button>

          {/* Secondary actions */}
          <div className="flex gap-3">
            <button className="quiz-btn quiz-btn-secondary flex-1" onClick={() => navigate("/")}>
              <Home size={15} />
              Trang chủ
            </button>
            <button
              className="quiz-btn quiz-btn-secondary flex-1"
              onClick={() => navigate(topicId === "mock" ? "/quiz/mock/exam" : `/quiz/${topicId}/${mode ?? "exam"}`)}
            >
              <RotateCcw size={15} />
              Làm lại
            </button>
            <button className="quiz-btn quiz-btn-secondary flex-1" onClick={() => navigate("/leaderboard")}>
              <Trophy size={15} />
              Xếp hạng
            </button>
          </div>
        </motion.div>

        {/* Quick summary grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3
            className="font-bold mb-3 flex items-center gap-2"
            style={{ color: "var(--quiz-text)", fontSize: "0.95rem" }}
          >
            <span style={{ color: "var(--quiz-blue)" }}>▌</span>
            Tổng quan câu hỏi
          </h3>
          <div className="quiz-card p-3">
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.answer;
                const noAns = !answers[q.id];
                return (
                  <button
                    key={q.id}
                    title={`Câu ${i + 1}: ${isCorrect ? "Đúng" : noAns ? "Bỏ qua" : "Sai"}`}
                    onClick={() => {
                      localStorage.setItem("quizReview", JSON.stringify(state));
                      navigate("/review");
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      background: noAns
                        ? "rgba(255,255,255,0.06)"
                        : isCorrect
                        ? "rgba(63,185,80,0.2)"
                        : "rgba(248,81,73,0.2)",
                      color: noAns
                        ? "var(--quiz-muted)"
                        : isCorrect
                        ? "var(--quiz-green)"
                        : "var(--quiz-red)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <p style={{ color: "var(--quiz-muted)", fontSize: "0.74rem", marginTop: 12, textAlign: "center" }}>
              Nhấn vào ô bất kỳ để xem lại đáp án chi tiết
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
