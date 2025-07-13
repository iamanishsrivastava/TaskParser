// src/utils/similarity.ts
export function getSimilarityScore(a: string, b: string): number {
  const wordsA = a.toLowerCase().split(/\s+/);
  const wordsB = b.toLowerCase().split(/\s+/);
  const common = wordsA.filter((word) => wordsB.includes(word));
  const total = new Set([...wordsA, ...wordsB]).size;
  return total === 0 ? 0 : common.length / total;
}
