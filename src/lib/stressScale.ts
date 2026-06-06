/** 压力测试题 82～91 的 5 档选项文案 */
export const STRESS_ANSWER_LABELS: Record<number, string> = {
  1: '完全不是',
  2: '基本不符合',
  3: '一般',
  4: '普遍如此',
  5: '非常符合',
};

export function stressAnswerLabel(score: number | undefined): string {
  if (score == null || score < 1 || score > 5) return '—';
  return STRESS_ANSWER_LABELS[score] ?? '—';
}

/** 李克特 1～5 对应量表轨道第几格（1=最左，5=最右） */
export function stressAnswerColumn(score: number | undefined): number {
  if (score == null || score < 1 || score > 5) return 3;
  return score;
}
