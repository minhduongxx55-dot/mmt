import { Router } from "express";
import { db, questionOverridesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { UpdateQuestionBody } from "@workspace/api-zod";

const router = Router();

router.get("/questions", async (req, res) => {
  try {
    const rows = await db.select().from(questionOverridesTable);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to get question overrides");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/questions/:topicId/:questionId", async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const questionId = parseInt(req.params.questionId);

    if (isNaN(questionId)) {
      res.status(400).json({ error: "Invalid question ID" });
      return;
    }

    const body = UpdateQuestionBody.parse(req.body);

    const existing = await db
      .select()
      .from(questionOverridesTable)
      .where(
        and(
          eq(questionOverridesTable.topicId, topicId),
          eq(questionOverridesTable.questionId, questionId)
        )
      )
      .limit(1);

    let row;
    if (existing.length > 0) {
      [row] = await db
        .update(questionOverridesTable)
        .set({
          questionText: body.questionText,
          optionA: body.optionA,
          optionB: body.optionB,
          optionC: body.optionC,
          optionD: body.optionD,
          answer: body.answer,
        })
        .where(
          and(
            eq(questionOverridesTable.topicId, topicId),
            eq(questionOverridesTable.questionId, questionId)
          )
        )
        .returning();
    } else {
      [row] = await db
        .insert(questionOverridesTable)
        .values({
          topicId,
          questionId,
          questionText: body.questionText,
          optionA: body.optionA,
          optionB: body.optionB,
          optionC: body.optionC,
          optionD: body.optionD,
          answer: body.answer,
        })
        .returning();
    }

    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Failed to update question");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.delete("/questions/:topicId/:questionId", async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const questionId = parseInt(req.params.questionId);

    if (isNaN(questionId)) {
      res.status(400).json({ error: "Invalid question ID" });
      return;
    }

    await db
      .delete(questionOverridesTable)
      .where(
        and(
          eq(questionOverridesTable.topicId, topicId),
          eq(questionOverridesTable.questionId, questionId)
        )
      );

    res.json({ message: "Override deleted" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete question override");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
