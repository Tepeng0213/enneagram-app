import tritypeMapping from '../data/tritypeMapping.json';
import { CENTERS, type CenterKey } from './scoring';
import type { ReportFacts } from '../types/report';
import { typeSelfName } from '../data/centerNarratives';

export interface TritypeDynamics {
  keyword: string;
  description: string;
}

export interface TritypeMappingEntry {
  tritype: string;
  alias: string;
  nodes: {
    action_center: string;
    feeling_center: string;
    thinking_center: string;
  };
  dynamics: {
    action_to_feeling: TritypeDynamics;
    action_to_thinking: TritypeDynamics;
    feeling_to_thinking: TritypeDynamics;
  };
}

export type CenterVariant = 'action' | 'feeling' | 'thinking';

export interface TriangleVertexSlot {
  centerKey: CenterKey;
  type: number;
  score: number;
  axisLabel: string;
  variant: CenterVariant;
}

export interface TriangleLayout {
  /** 三中心得分最高 → 上顶点 */
  top: TriangleVertexSlot;
  /** 得分次高 → 左下 */
  bottomLeft: TriangleVertexSlot;
  /** 得分第三 → 右下 */
  bottomRight: TriangleVertexSlot;
}

export interface TritypeDiagramData {
  tritype: string;
  alias: string;
  layout: TriangleLayout;
  /** 体/心/脑主型（查表与边注用，不随顶点位置变） */
  actionType: number;
  feelingType: number;
  thinkingType: number;
  /** 上顶点核心自我的翼型，无则 null */
  auxiliaryType: number | null;
  edges: {
    actionToFeeling: TritypeDynamics;
    actionToThinking: TritypeDynamics;
    feelingToThinking: TritypeDynamics;
  };
}

const CENTER_VARIANT: Record<CenterKey, CenterVariant> = {
  body: 'action',
  heart: 'feeling',
  head: 'thinking',
};

/** 同分时稳定顺序：行动 < 情感 < 思维 */
const CENTER_SORT_ORDER: Record<CenterKey, number> = {
  body: 0,
  heart: 1,
  head: 2,
};

/**
 * 顶点宝座：三中心按得分排序，最高在上，其余占左下与右下。
 */
export function assignTriangleLayout(centers: ReportFacts['centers']): TriangleLayout {
  const slots: TriangleVertexSlot[] = (['body', 'heart', 'head'] as const).map((key) => ({
    centerKey: key,
    type: centers[key].type,
    score: centers[key].score,
    axisLabel: CENTER_EDGE_LABELS[key],
    variant: CENTER_VARIANT[key],
  }));

  slots.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return CENTER_SORT_ORDER[a.centerKey] - CENTER_SORT_ORDER[b.centerKey];
  });

  return {
    top: slots[0],
    bottomLeft: slots[1],
    bottomRight: slots[2],
  };
}

const MAPPING = tritypeMapping as TritypeMappingEntry[];

/** 行动→情感→思维（体→心→脑），九型圈常见写法，如 926 */
export function tritypeCenterOrderKey(centers: ReportFacts['centers']): string {
  return `${centers.body.type}${centers.heart.type}${centers.head.type}`;
}

/** 三型编号升序，资料库多数条目的 tritype 键，如 847 → 478 */
export function tritypeSortedKey(centers: ReportFacts['centers']): string {
  return [centers.body.type, centers.heart.type, centers.head.type]
    .sort((a, b) => a - b)
    .join('');
}

/** 生成所有可能的查表键（去重） */
export function tritypeLookupKeys(centers: ReportFacts['centers']): string[] {
  const a = tritypeCenterOrderKey(centers);
  const b = tritypeSortedKey(centers);
  return a === b ? [a] : [a, b];
}

/** @deprecated 请用 lookupTritypeForCenters；保留兼容单键查询 */
export function tritypeFromCenters(centers: ReportFacts['centers']): string {
  return tritypeCenterOrderKey(centers);
}

export function lookupTritype(code: string): TritypeMappingEntry | undefined {
  return MAPPING.find((e) => e.tritype === code);
}

/** 三型编号升序键，如 "748" → "478" */
export function tritypeSortedFromCode(code: string): string | null {
  if (!/^\d{3}$/.test(code)) return null;
  return [...code].map(Number).sort((a, b) => a - b).join('');
}

/** 单键或升序键查 27 种映射（兼容 748 与 478 两种写法） */
export function lookupTritypeFlexible(code: string): TritypeMappingEntry | undefined {
  return lookupTritype(code) ?? lookupTritype(tritypeSortedFromCode(code) ?? '') ?? undefined;
}

/**
 * 按三中心查 27 种映射。
 * 资料库键名混用两种约定：升序（478）或行动-情感-思维（926），此处两种都试。
 */
export function lookupTritypeForCenters(
  centers: ReportFacts['centers']
): TritypeMappingEntry | undefined {
  for (const key of tritypeLookupKeys(centers)) {
    const entry = lookupTritype(key);
    if (entry) return entry;
  }
  return undefined;
}

/** 主型相邻翼中分数较高者；同分则取全库第二高分 */
export function computeWingType(coreType: number, scores: Record<number, number>): number {
  const prev = coreType === 1 ? 9 : coreType - 1;
  const next = coreType === 9 ? 1 : coreType + 1;
  const prevScore = scores[prev] ?? 0;
  const nextScore = scores[next] ?? 0;
  if (prevScore !== nextScore) {
    return prevScore > nextScore ? prev : next;
  }

  let bestType = 0;
  let bestScore = -1;
  for (let t = 1; t <= 9; t++) {
    if (t === coreType) continue;
    const s = scores[t] ?? 0;
    if (s > bestScore) {
      bestScore = s;
      bestType = t;
    }
  }
  return bestType;
}

/**
 * 上顶点「核心自我」的侧翼：仅在其相邻两型中取得分较高者。
 */
export function resolveWingAuxiliary(
  coreSelfType: number,
  scores: Record<number, number>
): number | null {
  const prev = coreSelfType === 1 ? 9 : coreSelfType - 1;
  const next = coreSelfType === 9 ? 1 : coreSelfType + 1;
  const prevScore = scores[prev] ?? 0;
  const nextScore = scores[next] ?? 0;
  if (prevScore === 0 && nextScore === 0) return null;
  const wing = prevScore >= nextScore ? prev : next;
  return wing === coreSelfType ? null : wing;
}

type DynamicsPairKey = keyof TritypeMappingEntry['dynamics'];

const DYNAMICS_BY_CENTER_PAIR: Partial<Record<`${CenterKey}_${CenterKey}`, DynamicsPairKey>> = {
  body_heart: 'action_to_feeling',
  heart_body: 'action_to_feeling',
  body_head: 'action_to_thinking',
  head_body: 'action_to_thinking',
  heart_head: 'feeling_to_thinking',
  head_heart: 'feeling_to_thinking',
};

/** 两中心之间的联结词（与三角顶点位置无关） */
export function dynamicsBetweenCenters(
  a: CenterKey,
  b: CenterKey,
  edges: TritypeDiagramData['edges']
): TritypeDynamics | null {
  const key = DYNAMICS_BY_CENTER_PAIR[`${a}_${b}`];
  if (!key) return null;
  const map: Record<DynamicsPairKey, TritypeDynamics> = {
    action_to_feeling: edges.actionToFeeling,
    action_to_thinking: edges.actionToThinking,
    feeling_to_thinking: edges.feelingToThinking,
  };
  return map[key];
}

export function buildTritypeDiagram(facts: ReportFacts): TritypeDiagramData | null {
  const entry =
    (facts.tritype && lookupTritypeFlexible(facts.tritype)) ||
    lookupTritypeForCenters(facts.centers);
  if (!entry) return null;
  const code = entry.tritype;

  const layout = assignTriangleLayout(facts.centers);
  const actionType = facts.centers.body.type;
  const feelingType = facts.centers.heart.type;
  const thinkingType = facts.centers.head.type;
  const auxiliaryType = resolveWingAuxiliary(layout.top.type, facts.scores);

  return {
    tritype: code,
    alias: entry.alias,
    layout,
    actionType,
    feelingType,
    thinkingType,
    auxiliaryType,
    edges: {
      actionToFeeling: entry.dynamics.action_to_feeling,
      actionToThinking: entry.dynamics.action_to_thinking,
      feelingToThinking: entry.dynamics.feeling_to_thinking,
    },
  };
}

export function selfLabelForType(type: number): string {
  return typeSelfName(type);
}

export const CENTER_EDGE_LABELS: Record<CenterKey, string> = {
  body: '行动中心',
  heart: '情感',
  head: '思维',
};
