import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getTopicById, shuffleAllQuestions } from "@/data";
import type { Question } from "@/data";
import { useGetQuestionOverrides } from "@workspace/api-client-react";
import { ChevronRight, ChevronLeft, Flag, Clock, X, CheckCircle, XCircle, GraduationCap } from "lucide-react";

export default function QuizPage() {
  const { topicId, mode: modeParam } = useParams<{ topicId: string; mode?: string }>();
  const [, navigate] = useLocation();
  const playerName = localStorage.getItem("playerName") || "Anonymous";
  const mode: "exam" | "practice" = modeParam === "practice" ? "practice" : "exam";

  const topic = getTopicById(topicId || "");
  const { data: overrides } = useGetQuestionOverrides();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!topic) { navigate("/"); return; }
    let qs = topic.questions;
    if (overrides && overrides.length > 0) {
      const overrideMap: Record<number, typeof overrides[0]> = {};
      overrides.filter(o => o.topicId === topicId).forEach(o => { overrideMap[o.questionId] = o; });
      qs = qs.map(q => {
        const ov = overrideMap[q.id];
        if (!ov) return q;
        return {
          ...q,
          question: ov.questionText,
          options: { A: ov.optionA, B: ov.optionB, C: ov.optionC, D: ov.optionD },
          answer: ov.answer as 'A' | 'B' | 'C' | 'D',
        };
      });
    }
    setQuestions(shuffleAllQuestions(qs));
    setQuizStarted(true);
  }, [topic, overrides, topicId]);

  useEffect(() => {
    if (!quizStarted) return;
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [quizStarted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAnswer = useCallback((key: string) => {
    const q = questions[currentIdx];
    if (!q) return;
    if (mode === "practice" && revealed) return;
    setAnswers(prev => ({ ...prev, [q.id]: key }));
    setRevealed(false);
  }, [questions, currentIdx, answers, mode, revealed]);

  const handlePracticeReveal = () => {
    setRevealed(true);
  };

  const handlePracticeNext = () => {
    setRevealed(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!topic || questions.length === 0) return;
    const correctAnswers = questions.filter(q => answers[q.id] === q.answer).length;
    const score = Number(((correctAnswers / questions.length) * 10).toFixed(1));

    localStorage.setItem("quizResult", JSON.stringify({
      playerName,
      topicId: topic.id,
      topicName: topic.name,
      questions,
      answers,
      score,
      correctAnswers,
      timeElapsed,
      mode,
    }));
    navigate("/results");
  };

  const handleExamNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(i => i + 1);
  };

  const handleExamPrev = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  if (!topic) return null;
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--quiz-bg)" }}>
        <div style={{ color: "var(--quiz-muted)", fontFamily: "monospace" }}>Đang tải câu hỏi...</div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answered = answers[currentQ.id];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const optionKeys: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  const isLastQuestion = currentIdx === questions.length - 1;

  const getOptionStyle = (key: string) => {
    if (mode === "practice" && revealed && answered) {
      const isCorrect = key === currentQ.answer;
      const isUserWrong = key === answered && answered !== currentQ.answer;
      if (isCorrect) return {
        borderColor: "var(--quiz-green)",
        background: "rgba(63,185,80,0.12)",
        color: "var(--quiz-text)",
      };
      if (isUserWrong) return {
        borderColor: "var(--quiz-red)",
        background: "rgba(248,81,73,0.12)",
        color: "var(--quiz-text)",
      };
      return { opacity: 0.4 };
    }
    if (mode === "exam" && key === answered) return {
      borderColor: "var(--quiz-blue)",
      background: "rgba(56,139,253,0.12)",
    };
    if (mode === "practice" && key === answered && !revealed) return {
      borderColor: "var(--quiz-blue)",
      background: "rgba(56,139,253,0.12)",
    };
    return {};
  };

  const getKeyStyle = (key: string) => {
    if (mode === "practice" && revealed && answered) {
      const isCorrect = key === currentQ.answer;
      const isUserWrong = key === answered && answered !== currentQ.answer;
      if (isCorrect) return { background: "var(--quiz-green)", color: "#fff", borderColor: "var(--quiz-green)" };
      if (isUserWrong) return { background: "var(--quiz-red)", color: "#fff", borderColor: "var(--quiz-red)" };
      return {};
    }
    if (key === answered) return { background: "var(--quiz-blue)", color: "#fff", borderColor: "var(--quiz-blue)" };
    return {};
  };

  const practiceCorrect = mode === "practice" && revealed && answered === currentQ.answer;
  const practiceWrong = mode === "practice" && revealed && answered && answered !== currentQ.answer;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--quiz-bg)" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-20"
        style={{ background: "rgba(13,17,23,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--quiz-border)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            className="quiz-btn quiz-btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
            onClick={() => setShowConfirmLeave(true)}
          >
            <X size={14} />
          </button>
          <div className="flex-1">
            <div style={{ color: "var(--quiz-muted)", fontSize: "0.75rem", marginBottom: 4 }}>
              <span style={{ color: mode === "practice" ? "var(--quiz-green)" : "var(--quiz-blue)" }}>●</span>{" "}
              {topic.name} — Câu {currentIdx + 1}/{questions.length}
              {mode === "practice" && (
                <span
                  className="ml-2 quiz-tag"
                  style={{ color: "var(--quiz-green)", borderColor: "rgba(63,185,80,0.3)", background: "rgba(63,185,80,0.08)", fontSize: "0.65rem" }}
                >
                  <GraduationCap size={10} style={{ display: "inline", marginRight: 2 }} />
                  Luyện tập
                </span>
              )}
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ background: mode === "practice" ? "var(--quiz-green)" : undefined }}
              />
            </div>
          </div>
          <div
            className="flex items-center gap-1.5"
            style={{ color: "var(--quiz-muted)", fontSize: "0.8rem", fontFamily: "monospace", whiteSpace: "nowrap" }}
          >
            <Clock size={13} />
            {formatTime(timeElapsed)}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="quiz-card p-6 mb-5">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="flex items-center justify-center rounded-lg font-bold text-sm flex-shrink-0"
                  style={{
                    width: 36, height: 36,
                    background: mode === "practice" ? "rgba(63,185,80,0.12)" : "rgba(56,139,253,0.12)",
                    border: `1px solid ${mode === "practice" ? "rgba(63,185,80,0.3)" : "rgba(56,139,253,0.3)"}`,
                    color: mode === "practice" ? "var(--quiz-green)" : "var(--quiz-blue)",
                  }}
                >
                  {currentIdx + 1}
                </div>
                <p className="text-base leading-relaxed" style={{ color: "var(--quiz-text)", paddingTop: 6 }}>
                  {currentQ.question}
                </p>
              </div>

              {currentQ.image && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={currentQ.image}
                    alt={`Hình vẽ câu ${currentIdx + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 320,
                      borderRadius: 8,
                      border: "1px solid var(--quiz-border)",
                      background: "#fff",
                      padding: 8,
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                {optionKeys.map(key => {
                  const optionText = currentQ.options[key];
                  if (!optionText) return null;
                  const optStyle = getOptionStyle(key);
                  const keyStyle = getKeyStyle(key);
                  const isDisabled = mode === "practice" ? revealed : false;

                  return (
                    <motion.button
                      key={key}
                      className="option-btn"
                      style={optStyle}
                      onClick={() => handleAnswer(key)}
                      disabled={isDisabled}
                      whileHover={!isDisabled ? { x: 3 } : {}}
                      whileTap={!isDisabled ? { scale: 0.99 } : {}}
                    >
                      <span
                        className="option-key"
                        style={keyStyle}
                      >
                        {key}
                      </span>
                      <span style={{ flex: 1 }}>{optionText}</span>
                      {mode === "practice" && revealed && key === currentQ.answer && (
                        <CheckCircle size={16} style={{ color: "var(--quiz-green)", flexShrink: 0 }} />
                      )}
                      {mode === "practice" && revealed && key === answered && answered !== currentQ.answer && (
                        <XCircle size={16} style={{ color: "var(--quiz-red)", flexShrink: 0 }} />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Practice mode feedback */}
              <AnimatePresence>
                {mode === "practice" && revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 p-3 rounded-lg flex items-center gap-2"
                    style={{
                      background: practiceCorrect ? "rgba(63,185,80,0.1)" : "rgba(248,81,73,0.1)",
                      border: `1px solid ${practiceCorrect ? "rgba(63,185,80,0.4)" : "rgba(248,81,73,0.4)"}`,
                    }}
                  >
                    {practiceCorrect ? (
                      <>
                        <CheckCircle size={18} style={{ color: "var(--quiz-green)", flexShrink: 0 }} />
                        <span style={{ color: "var(--quiz-green)", fontWeight: 600, fontSize: "0.9rem" }}>
                          Đáp án đúng!
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} style={{ color: "var(--quiz-red)", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.88rem" }}>
                          <span style={{ color: "var(--quiz-red)", fontWeight: 600 }}>Sai!</span>
                          <span style={{ color: "var(--quiz-muted)" }}>{" "}Đáp án đúng là{" "}</span>
                          <span style={{ color: "var(--quiz-green)", fontWeight: 700 }}>
                            {currentQ.answer}: {currentQ.options[currentQ.answer!]}
                          </span>
                        </span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation — Practice mode */}
        {mode === "practice" && (
          <div className="flex items-center justify-between mb-6">
            <div style={{ color: "var(--quiz-muted)", fontSize: "0.82rem" }}>
              {answeredCount > 0 && (
                <span>
                  <span style={{ color: "var(--quiz-green)" }}>{questions.filter((q, i) => i < currentIdx && answers[q.id] === q.answer).length + (revealed && practiceCorrect ? 1 : 0)}</span>
                  {" "}đúng /{" "}
                  <span style={{ color: "var(--quiz-red)" }}>{questions.filter((q, i) => i < currentIdx && answers[q.id] !== q.answer).length + (revealed && practiceWrong ? 1 : 0)}</span>
                  {" "}sai
                </span>
              )}
            </div>

            {!answered && (
              <div style={{ color: "var(--quiz-muted)", fontSize: "0.82rem" }}>
                Chọn đáp án...
              </div>
            )}

            {answered && !revealed && (
              <button
                className="quiz-btn quiz-btn-primary"
                onClick={handlePracticeReveal}
              >
                Tiếp tục
                <ChevronRight size={16} />
              </button>
            )}

            {revealed && (
              <button
                className="quiz-btn"
                onClick={handlePracticeNext}
                style={{
                  background: isLastQuestion ? "var(--quiz-green)" : "var(--quiz-blue)",
                  color: "#fff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                {isLastQuestion ? (
                  <><Flag size={15} /> Hoàn thành</>
                ) : (
                  <>Câu tiếp theo <ChevronRight size={16} /></>
                )}
              </button>
            )}
          </div>
        )}

        {/* Navigation — Exam mode */}
        {mode === "exam" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <button
                className="quiz-btn quiz-btn-secondary"
                onClick={handleExamPrev}
                disabled={currentIdx === 0}
              >
                <ChevronLeft size={16} />
                Trước
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  className="quiz-btn quiz-btn-primary"
                  onClick={handleExamNext}
                >
                  Tiếp
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  className="quiz-btn quiz-btn-primary"
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  title={!allAnswered ? `Còn ${questions.length - answeredCount} câu chưa trả lời` : ""}
                >
                  <Flag size={15} />
                  Nộp bài
                </button>
              )}
            </div>

            {/* Scrollable nav dots */}
            <div
              className="quiz-card p-3 mb-4"
              style={{ maxHeight: 160, overflowY: "auto" }}
            >
              <div className="flex flex-wrap gap-1.5 justify-start">
                {questions.map((q, i) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = i === currentIdx;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      style={{
                        width: 28, height: 28,
                        borderRadius: 5,
                        border: `1px solid ${isCurrent ? "var(--quiz-blue)" : isAnswered ? "var(--quiz-green)" : "var(--quiz-border)"}`,
                        background: isCurrent ? "rgba(56,139,253,0.18)" : isAnswered ? "rgba(63,185,80,0.1)" : "transparent",
                        color: isCurrent ? "var(--quiz-blue)" : isAnswered ? "var(--quiz-green)" : "var(--quiz-muted)",
                        fontFamily: "monospace",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div
              className="quiz-card p-3 flex items-center justify-between"
              style={{ fontSize: "0.8rem", color: "var(--quiz-muted)" }}
            >
              <span>
                <span style={{ color: "var(--quiz-green)", fontWeight: 600 }}>{answeredCount}</span>/{questions.length} đã trả lời
              </span>
              <span>
                Còn{" "}
                <span style={{ color: "var(--quiz-yellow)", fontWeight: 600 }}>{questions.length - answeredCount}</span>{" "}
                câu
              </span>
              {allAnswered && (
                <button
                  className="quiz-btn quiz-btn-primary"
                  style={{ padding: "5px 14px", fontSize: "0.8rem" }}
                  onClick={handleSubmit}
                >
                  <Flag size={13} /> Nộp ngay
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirm leave modal */}
      <AnimatePresence>
        {showConfirmLeave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="quiz-card p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold mb-2">Thoát bài thi?</h3>
              <p style={{ color: "var(--quiz-muted)", fontSize: "0.875rem", marginBottom: 20 }}>
                Tiến trình làm bài sẽ bị mất nếu bạn thoát ra ngoài.
              </p>
              <div className="flex gap-3 justify-end">
                <button className="quiz-btn quiz-btn-secondary" onClick={() => setShowConfirmLeave(false)}>
                  Tiếp tục thi
                </button>
                <button className="quiz-btn quiz-btn-danger" onClick={() => navigate("/")}>
                  Thoát
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
