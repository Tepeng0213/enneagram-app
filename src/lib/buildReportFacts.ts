import type { CenterKey, ScoreResult } from './scoring';
import type { ReportFacts } from '../types/report';
import { formatReportDate } from './formatDate';
import type { SummaryRowPayload } from './sheetApi';
import { computeWingType, lookupTritypeForCenters, tritypeCenterOrderKey } from './tritype';

const STORAGE_KEY = 'profigram_last_result';

export interface StoredResult {
  name: string;
  testedAt: string;
  result: ScoreResult;
  sheetRow?: number;
}

function enrichFacts(
  base: Omit<ReportFacts, 'tritype' | 'tritypeAlias' | 'wingType'> & {
    scores: Record<number, number>;
    centers: ScoreResult['centers'];
    coreType: number;
  }
): ReportFacts {
  const entry = lookupTritypeForCenters(base.centers);
  return {
    ...base,
    tritype: entry?.tritype ?? tritypeCenterOrderKey(base.centers),
    tritypeAlias: entry?.alias,
    wingType: computeWingType(base.coreType, base.scores),
  };
}

export function buildReportFacts(
  name: string,
  result: ScoreResult,
  testedAt = new Date().toISOString(),
  sheetRow?: number
): ReportFacts {
  return enrichFacts({
    name,
    testedAt: formatReportDate(testedAt),
    sheetRow,
    scores: { ...result.scores },
    coreType: result.coreType,
    coreScore: result.coreScore,
    centers: result.centers,
  });
}

/** 将 Google 表格「汇总」一行转为报告 facts */
export function factsFromSummaryRow(row: number, data: SummaryRowPayload): ReportFacts {
  const scores: Record<number, number> = {};
  for (let t = 1; t <= 9; t++) {
    const v = data.scores[String(t)] ?? data.scores[t];
    scores[t] = Number(v) || 0;
  }

  const centers = {} as ScoreResult['centers'];
  (['body', 'heart', 'head'] as CenterKey[]).forEach((key) => {
    const c = data.centers[key];
    centers[key] = {
      type: Number(c.type),
      score: Number(c.score),
      resolvedBy: c.resolvedBy || 'unique',
    };
  });

  return enrichFacts({
    name: data.name,
    testedAt: formatReportDate(data.timestamp),
    sheetRow: row,
    scores,
    coreType: Number(data.coreType) || 0,
    coreScore: Number(data.coreScore) || scores[data.coreType] || 0,
    centers,
    stressAnswers: normalizeStressAnswers(data.stressAnswers),
  });
}

function normalizeStressAnswers(
  raw?: Record<string | number, number>
): Record<number, number> | undefined {
  if (!raw) return undefined;
  const out: Record<number, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const n = Number(v);
    if (n >= 1 && n <= 5) out[Number(k)] = n;
  }
  const STRESS_IDS = [82, 83, 84, 85, 86, 87, 88, 89, 90, 91];
  const complete = STRESS_IDS.every((id) => out[id] != null);
  return complete ? out : Object.keys(out).length ? out : undefined;
}

export function saveResultForReport(payload: StoredResult): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadResultForReport(): StoredResult | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredResult;
  } catch {
    return null;
  }
}

/** 样例数据（对齐样例 PDF：主型 9） */
export function sampleReportFacts(): ReportFacts {
  const scores = { 1: 34, 2: 32, 3: 29, 4: 29, 5: 27, 6: 35, 7: 26, 8: 24, 9: 37 };
  return enrichFacts({
    name: '样例用户',
    testedAt: '2026-03-29',
    scores,
    coreType: 9,
    coreScore: 37,
    centers: {
      body: { type: 9, score: 37, resolvedBy: 'unique' },
      heart: { type: 2, score: 32, resolvedBy: 'unique' },
      head: { type: 6, score: 35, resolvedBy: 'unique' },
    },
    stressAnswers: {
      82: 4,
      83: 3,
      84: 2,
      85: 3,
      86: 4,
      87: 2,
      88: 3,
      89: 4,
      90: 2,
      91: 5,
    },
  });
}
