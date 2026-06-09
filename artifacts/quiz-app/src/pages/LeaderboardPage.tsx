import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useGetRankings } from "@workspace/api-client-react";
import { allTopics } from "@/data";
import { Trophy, ArrowLeft, Medal, Clock, RefreshCw } from "lucide-react";

export default function LeaderboardPage() {
  const [, navigate] = useLocation();
  const [filterTopic, setFilterTopic] = useState<string>("all");

  const { data: rankings, isLoading, refetch } = useGetRankings(
    filterTopic !== "all" ? { topicId: filterTopic, limit: 50 } : { limit: 50 }
  );

  const topicColors: Record<string, string> = {
    topic1: "var(--quiz-blue)",
    topic2: "var(--quiz-cyan)",
    topic3: "var(--quiz-purple)",
    topic4: "var(--quiz-yellow)",
    topic5: "var(--quiz-green)",
    topic6: "var(--quiz-red)",
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: "🥇", color: "#ffd700" };
    if (rank === 2) return { icon: "🥈", color: "#c0c0c0" };
    if (rank === 3) return { icon: "🥉", color: "#cd7f32" };
    return { icon: `#${rank}`, color: "var(--quiz-muted)" };
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "var(--quiz-green)";
    if (score >= 5) return "var(--quiz-yellow)";
    return "var(--quiz-red)";
  };

  const currentPlayerName = localStorage.getItem("playerName") || "";

  return (
    <div className="min-h-screen" style={{ background: "var(--quiz-bg)" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(56,139,253,0.06) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            className="quiz-btn quiz-btn-secondary"
            style={{ padding: "8px 14px" }}
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Trophy size={20} style={{ color: "var(--quiz-yellow)" }} />
              Bảng Xếp Hạng
            </h1>
            <p style={{ color: "var(--quiz-muted)", fontSize: "0.8rem" }}>
              Top điểm cao nhất
            </p>
          </div>
          <button
            className="quiz-btn quiz-btn-secondary"
            style={{ padding: "8px 12px" }}
            onClick={() => refetch()}
            title="Làm mới"
          >
            <RefreshCw size={15} />
          </button>
        </motion.div>

        {/* Topic filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 flex-wrap mb-6"
        >
          <button
            onClick={() => setFilterTopic("all")}
            className="quiz-btn"
            style={{
              fontSize: "0.78rem",
              padding: "6px 14px",
              background: filterTopic === "all" ? "var(--quiz-blue)" : "transparent",
              borderColor: filterTopic === "all" ? "var(--quiz-blue)" : "var(--quiz-border)",
              color: filterTopic === "all" ? "#fff" : "var(--quiz-muted)",
            }}
          >
            Tất cả
          </button>
          {allTopics.map(t => (
            <button
              key={t.id}
              onClick={() => setFilterTopic(t.id)}
              className="quiz-btn"
              style={{
                fontSize: "0.78rem",
                padding: "6px 14px",
                background: filterTopic === t.id ? `${topicColors[t.id]}20` : "transparent",
                borderColor: filterTopic === t.id ? topicColors[t.id] : "var(--quiz-border)",
                color: filterTopic === t.id ? topicColors[t.id] : "var(--quiz-muted)",
              }}
            >
              {t.name.split("–")[0].trim()}
            </button>
          ))}
        </motion.div>

        {/* Rankings table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="quiz-card overflow-hidden"
        >
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#ff5f57" }} />
            <div className="terminal-dot" style={{ background: "#ffbd2e" }} />
            <div className="terminal-dot" style={{ background: "#28c840" }} />
            <span style={{ color: "var(--quiz-muted)", fontSize: "0.72rem", marginLeft: 8 }}>
              leaderboard.db — {rankings?.length || 0} entries
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-16" style={{ color: "var(--quiz-muted)", fontSize: "0.875rem" }}>
              <RefreshCw size={16} className="animate-spin mr-2" /> Đang tải...
            </div>
          ) : !rankings || rankings.length === 0 ? (
            <div className="text-center p-16" style={{ color: "var(--quiz-muted)" }}>
              <Trophy size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <p style={{ fontSize: "0.875rem" }}>Chưa có kết quả nào</p>
              <p style={{ fontSize: "0.78rem", marginTop: 4 }}>Hãy là người đầu tiên!</p>
            </div>
          ) : (
            <div>
              {rankings.map((entry, i) => {
                const { icon, color } = getRankIcon(i + 1);
                const isMe = entry.playerName === currentPlayerName;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      borderBottom: i < rankings.length - 1 ? "1px solid rgba(48,54,61,0.5)" : "none",
                      background: isMe ? "rgba(56,139,253,0.05)" : "transparent",
                    }}
                  >
                    {/* Rank */}
                    <div
                      style={{
                        width: 36,
                        textAlign: "center",
                        fontSize: i < 3 ? "1.2rem" : "0.8rem",
                        fontWeight: 700,
                        color,
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-semibold text-sm truncate"
                          style={{ color: isMe ? "var(--quiz-blue)" : "var(--quiz-text)" }}
                        >
                          {entry.playerName}
                          {isMe && (
                            <span style={{ color: "var(--quiz-blue)", fontSize: "0.7rem", marginLeft: 6 }}>(bạn)</span>
                          )}
                        </span>
                        <span
                          className="quiz-tag"
                          style={{
                            fontSize: "0.68rem",
                            color: topicColors[entry.topicId] || "var(--quiz-muted)",
                            borderColor: `${topicColors[entry.topicId] || "var(--quiz-border)"}40`,
                            background: `${topicColors[entry.topicId] || "var(--quiz-border)"}10`,
                          }}
                        >
                          {entry.topicName.split("–")[0].trim()}
                        </span>
                      </div>
                      <div style={{ color: "var(--quiz-muted)", fontSize: "0.7rem", marginTop: 2 }}>
                        {entry.correctAnswers}/{entry.totalQuestions} đúng · {formatDate(entry.createdAt)}
                      </div>
                    </div>

                    {/* Score */}
                    <div
                      className="font-bold text-xl flex-shrink-0"
                      style={{ color: getScoreColor(entry.score), fontFamily: "monospace" }}
                    >
                      {entry.score.toFixed(1)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <button
            className="quiz-btn quiz-btn-primary"
            onClick={() => navigate("/")}
          >
            Thi ngay
          </button>
        </motion.div>
      </div>
    </div>
  );
}
