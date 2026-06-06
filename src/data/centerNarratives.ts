import type { CenterKey } from '../lib/scoring';
import { typeLabelWithNumber } from '../lib/enneagramTypes';

/** 三列左侧竖排标签 */
export const CENTER_AXIS_LABELS: Record<CenterKey, string> = {
  body: '行动',
  heart: '情感',
  head: '思维',
};

/** 九型「自我」称谓（与折线图、报告全文统一） */
export const TYPE_SELF_NAMES: Record<number, string> = {
  1: '改善的自我',
  2: '照顾的自我',
  3: '成就的自我',
  4: '表现的自我',
  5: '探究的自我',
  6: '信赖的自我',
  7: '享受的自我',
  8: '挑战的自我',
  9: '和解的自我',
};

/** 三中心主型说明（审定静态，按型号选取） */
export const TYPE_SELF_NARRATIVES: Record<number, string> = {
  1: '此类型重视原则与正确性。此类型追求客观与完美，并能展示在面对不完美的现实时，如何坚持高标准并致力于改善环境。',
  2: '此类型通过对他人的爱与照顾来寻找自身的价值。对别人的需求和情感产生深深的共鸣，并渴望自己也能被爱。',
  3: '此类型重视效率与成功。此类型通过努力达成目标来获取认可，并能展示在追求卓越的过程中如何灵活适应环境与展现自我价值。',
  4: '此类型重视真实与独特性。此类型追求深刻的个人意义，并能展示如何通过充沛的情感与创造力来表达最真实的内在自我。',
  5: '此类型重视知识与客观性。此类型追求对世界的深刻理解，并能展示在面对未知时如何通过理性分析与独立思考来获取安全感。',
  6: '此类型重视信任与稳定。有时虽然会感到不安，但这都是在更深入地理解并信任自己与他人的过程中出现的。',
  7: '此类型重视快乐与自由。此类型追求积极且新鲜的体验，并能展示在面对枯燥或限制时，如何保持乐观与探索无限的可能。',
  8: '此类型重视力量与自主。此类型追求对自身命运的绝对掌控，并能展示在面对困难与不公时，如何坚定果断地采取行动与保护弱小。',
  9: '此类型重视和平与和谐。此类型追求内在的平静，并能展示在冲突情境中如何努力去促成各方的协调与融合。',
};

export function typeSelfName(type: number): string {
  return TYPE_SELF_NAMES[type] ?? `${type}号的自我`;
}

/** 三中心标题两行：第一行 X号 XX型，第二行 （XX的自我） */
export function typeSelfTitleLines(type: number): { typeLine: string; selfLine: string } {
  return {
    typeLine: typeLabelWithNumber(type),
    selfLine: `（${typeSelfName(type)}）`,
  };
}

/** 单行完整标题（无障碍等） */
export function typeSelfDisplayTitle(type: number): string {
  const { typeLine, selfLine } = typeSelfTitleLines(type);
  return `${typeLine}${selfLine}`;
}

export function getTypeSelfNarrative(type: number): string {
  return (
    TYPE_SELF_NARRATIVES[type] ??
    `此类型呈现 ${typeSelfName(type)} 的典型特质，请结合三中心分数综合理解。`
  );
}
