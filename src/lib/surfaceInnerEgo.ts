import evaluations from '../data/surfaceInnerEvaluations.json';

/** Q82～Q91 题号（压力防御维度） */
export const STRESS_QUESTION_IDS = [82, 83, 84, 85, 86, 87, 88, 89, 90, 91] as const;

/** Q83 为积极维度反向题：转换后得分 = 6 - 原始得分 */
export const REVERSE_STRESS_QUESTION_ID = 83;

export interface SurfaceInnerResult {
  surfaceEgo: number;
  innerEgo: number;
  /** 10 题未齐或无效时用占位排版 */
  isPlaceholder: boolean;
  /** 转化后的总防御分（10～50），仅真实数据时有值 */
  totalDefenseScore?: number;
}

type EvalTier = (typeof evaluations)[number];

/** 单题原始分 → 计分用防御分（Q83 反向，其余直接用原始分） */
export function transformStressAnswerScore(questionId: number, raw: number): number {
  if (questionId === REVERSE_STRESS_QUESTION_ID) return 6 - raw;
  return raw;
}

function isValidRawScore(raw: unknown): raw is number {
  return typeof raw === 'number' && raw >= 1 && raw <= 5;
}

/** 是否集齐 Q82～Q91 共 10 题有效作答 */
export function hasCompleteStressAnswers(stressAnswers?: Record<number, number>): boolean {
  if (!stressAnswers) return false;
  return STRESS_QUESTION_IDS.every((qId) => isValidRawScore(stressAnswers[qId]));
}

/**
 * 由 Q82～Q91 计算表面 / 内在自我比例。
 *
 * - 总防御分 = Σ 转化后得分（范围 10～50）
 * - 内在自我 % = ((总防御分 - 10) / 40) × 100，四舍五入并限制在 0～100
 * - 表面自我 % = 100 - 内在自我 %
 */
export function computeSurfaceInnerEgo(
  stressAnswers?: Record<number, number>
): SurfaceInnerResult {
  const PLACEHOLDER: SurfaceInnerResult = {
    surfaceEgo: 21,
    innerEgo: 79,
    isPlaceholder: true,
  };

  if (!hasCompleteStressAnswers(stressAnswers)) return PLACEHOLDER;

  let total = 0;
  for (const qId of STRESS_QUESTION_IDS) {
    total += transformStressAnswerScore(qId, stressAnswers![qId]);
  }

  const innerRaw = ((total - 10) / 40) * 100;
  const innerEgo = Math.round(Math.min(100, Math.max(0, innerRaw)));
  const surfaceEgo = 100 - innerEgo;

  return { surfaceEgo, innerEgo, isPlaceholder: false, totalDefenseScore: total };
}

function lookupTier(surfaceEgo: number): EvalTier {
  const clamped = Math.min(100, Math.max(0, surfaceEgo));
  const hit =
    evaluations.find((t) => clamped >= t.minScore && clamped <= t.maxScore) ??
    evaluations[evaluations.length - 1];
  return hit;
}

/** 综合评估正文（{percentage} 替换为表面自我 %，即觉察度指标） */
export function buildSurfaceInnerEvaluation(surfaceEgo: number): string {
  const tier = lookupTier(surfaceEgo);
  return tier.evaluationTemplate.replace(/\{percentage\}/g, String(surfaceEgo));
}

/** 将评估文案中的百分比数字拆成可高亮片段 */
export function splitEvaluationHighlights(text: string): Array<{ text: string; highlight: boolean }> {
  const parts: Array<{ text: string; highlight: boolean }> = [];
  const re = /(\d+(?:\.\d+)?%?)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ text: text.slice(last, m.index), highlight: false });
    }
    parts.push({ text: m[1], highlight: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last), highlight: false });
  }
  return parts.length ? parts : [{ text, highlight: false }];
}
