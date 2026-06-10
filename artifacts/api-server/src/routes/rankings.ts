import { Router } from "express";
import { db, rankingsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { SubmitResultBody } from "@workspace/api-zod";

const router = Router();

router.get("/rankings", async (req, res) => {
  try {
    const topicId = req.query.topicId as string | undefined;
    const limit = Math.min(parseInt(req.query.limit as string || "50"), 100);

    let query = db.select().from(rankingsTable).orderBy(desc(rankingsTable.score), desc(rankingsTable.correctAnswers)).limit(limit);

    const rows = topicId
      ? await db.select().from(rankingsTable).where(eq(rankingsTable.topicId, topicId)).orderBy(desc(rankingsTable.score), desc(rankingsTable.correctAnswers)).limit(limit)
      : await query;

    const result = rows.map((r) => ({
      id: r.id,
      playerName: r.playerName,
      topicId: r.topicId,
      topicName: r.topicName,
      score: r.score,
      totalQuestions: r.totalQuestions,
      correctAnswers: r.correctAnswers,
      timeElapsed: r.timeElapsed ?? undefined,
      createdAt: r.createdAt.toISOString(),
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get rankings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rankings", async (req, res) => {
  try {
    const body = SubmitResultBody.parse(req.body);

    const [row] = await db
      .insert(rankingsTable)
      .values({
        playerName: body.playerName,
        topicId: body.topicId,
        topicName: body.topicName,
        score: body.score,
        totalQuestions: body.totalQuestions,
        correctAnswers: body.correctAnswers,
        timeElapsed: body.timeElapsed ?? null,
      })
      .returning();

    res.status(201).json({
      id: row.id,
      playerName: row.playerName,
      topicId: row.topicId,
      topicName: row.topicName,
      score: row.score,
      totalQuestions: row.totalQuestions,
      correctAnswers: row.correctAnswers,
      timeElapsed: row.timeElapsed ?? undefined,
      createdAt: row.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit result");
    res.status(400).json({ error: "Invalid request" });
  }
});

export default router;
