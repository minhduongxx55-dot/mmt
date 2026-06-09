import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rankingsTable = pgTable("rankings", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  topicId: text("topic_id").notNull(),
  topicName: text("topic_name").notNull(),
  score: real("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRankingSchema = createInsertSchema(rankingsTable).omit({ id: true, createdAt: true });
export type InsertRanking = z.infer<typeof insertRankingSchema>;
export type Ranking = typeof rankingsTable.$inferSelect;
