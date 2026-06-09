import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const questionOverridesTable = pgTable("question_overrides", {
  id: serial("id").primaryKey(),
  topicId: text("topic_id").notNull(),
  questionId: integer("question_id").notNull(),
  questionText: text("question_text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  answer: text("answer").notNull(),
});

export const insertQuestionOverrideSchema = createInsertSchema(questionOverridesTable).omit({ id: true });
export type InsertQuestionOverride = z.infer<typeof insertQuestionOverrideSchema>;
export type QuestionOverride = typeof questionOverridesTable.$inferSelect;
