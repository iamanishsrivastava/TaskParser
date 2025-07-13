// src/services/kbMatcher.mts

import { getSimilarityScore } from "../utils/similarity.mjs";
import { db } from "../utils/db.mts";

export async function matchFromKB(title: string) {
  const res = await db.query("SELECT * FROM task_pattern");
  const patterns = res.rows;

  let best = null;
  let maxScore = 0;

  for (const p of patterns) {
    const score = getSimilarityScore(p.pattern, title);
    if (score > maxScore && score > 0.6) {
      best = p;
      maxScore = score;
    }
  }

  return best;
}
