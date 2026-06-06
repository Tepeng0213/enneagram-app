/** 三大中心（与 INSIGHT BOOK 图2 一致） */
export const CENTERS = {
  body: { key: 'body', name: '体中心', types: [8, 9, 1] as const, middleType: 9 },
  heart: { key: 'heart', name: '心中心', types: [2, 3, 4] as const, middleType: 3 },
  head: { key: 'head', name: '头脑中心', types: [5, 6, 7] as const, middleType: 6 },
} as const;

export type CenterKey = keyof typeof CENTERS;
export type Answers = Record<number, number>; // questionId -> 1..5

export interface TypeScores {
  [type: number]: number;
}

export interface CenterWinner {
  type: number;
  score: number;
  resolvedBy: 'unique' | 'middle' | 'tiebreak';
  candidates?: number[];
}

export interface ScoreResult {
  scores: TypeScores;
  coreType: number;
  coreScore: number;
  centers: Record<CenterKey, CenterWinner>;
  tiebreakNeeded: Partial<Record<CenterKey, number[]>>;
}

export function computeTypeScores(answers: Answers, questionTypes: Map<number, number>): TypeScores {
  const scores: TypeScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const [qId, value] of Object.entries(answers)) {
    const type = questionTypes.get(Number(qId));
    if (type && value >= 1 && value <= 5) {
      scores[type] += value;
    }
  }
  return scores;
}

function resolveCenter(
  scores: TypeScores,
  types: readonly number[],
  middleType: number
): { winner: CenterWinner; tiebreak?: number[] } {
  const groupScores = types.map((t) => ({ type: t, score: scores[t] }));
  const max = Math.max(...groupScores.map((g) => g.score));
  const winners = groupScores.filter((g) => g.score === max).map((g) => g.type);

  if (winners.length === 1) {
    return {
      winner: { type: winners[0], score: max, resolvedBy: 'unique' },
    };
  }

  if (winners.length === 3) {
    return {
      winner: { type: middleType, score: max, resolvedBy: 'middle', candidates: winners },
    };
  }

  // 两人同分 → 需要决胜
  return {
    winner: { type: winners[0], score: max, resolvedBy: 'tiebreak', candidates: winners },
    tiebreak: winners,
  };
}

export function computeFullScore(
  answers: Answers,
  questionTypes: Map<number, number>
): ScoreResult {
  const scores = computeTypeScores(answers, questionTypes);
  const entries = Object.entries(scores).map(([t, s]) => ({ type: Number(t), score: s }));
  const coreScore = Math.max(...entries.map((e) => e.score));
  const coreType = entries.find((e) => e.score === coreScore)!.type;

  const centers = {} as Record<CenterKey, CenterWinner>;
  const tiebreakNeeded: Partial<Record<CenterKey, number[]>> = {};

  for (const key of Object.keys(CENTERS) as CenterKey[]) {
    const c = CENTERS[key];
    const { winner, tiebreak } = resolveCenter(scores, c.types, c.middleType);
    if (tiebreak) {
      tiebreakNeeded[key] = tiebreak;
      // 占位，tiebreak 提交后覆盖
      centers[key] = { ...winner, type: tiebreak[0], resolvedBy: 'tiebreak', candidates: tiebreak };
    } else {
      centers[key] = winner;
    }
  }

  return { scores, coreType, coreScore, centers, tiebreakNeeded };
}

export function applyTiebreakChoices(
  result: ScoreResult,
  choices: Partial<Record<CenterKey, number>>
): ScoreResult {
  const centers = { ...result.centers };
  for (const key of Object.keys(choices) as CenterKey[]) {
    const chosen = choices[key];
    if (chosen == null) continue;
    const prev = centers[key];
    centers[key] = {
      type: chosen,
      score: prev.score,
      resolvedBy: 'tiebreak',
      candidates: prev.candidates,
    };
  }
  return {
    ...result,
    centers,
    tiebreakNeeded: {},
  };
}
