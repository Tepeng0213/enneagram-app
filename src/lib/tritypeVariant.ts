import variantsData from '../data/tritypeVariants.json';
import type { TriangleLayout } from './tritype';
import type { ReportFacts } from '../types/report';
import {
  tritypeCenterOrderKey,
  tritypeLookupKeys,
  tritypeSortedFromCode,
  tritypeSortedKey,
} from './tritype';

export interface TritypeVariantEntry {
  core_node: string;
  left_node: string;
  right_node: string;
  wing_node: string;
  table_title: string;
  detailed_description: string[];
}

export interface TritypeVariantGroup {
  tritype_group: string;
  alias: string;
  variants: Record<string, TritypeVariantEntry>;
}

const GROUPS = variantsData as unknown as TritypeVariantGroup[];

/** 三角布局 → 变体键（上-左下-右下，仅作备选） */
export function variantLayoutKey(layout: TriangleLayout): string {
  return `${layout.top.type}${layout.bottomLeft.type}${layout.bottomRight.type}`;
}

function findGroup(tritypeGroup: string): TritypeVariantGroup | undefined {
  return GROUPS.find((g) => g.tritype_group === tritypeGroup);
}

function groupKeysForLookup(centers: ReportFacts['centers'], tritypeHint?: string): string[] {
  const keys = new Set<string>();
  if (tritypeHint) {
    keys.add(tritypeHint);
    const sorted = tritypeSortedFromCode(tritypeHint);
    if (sorted) keys.add(sorted);
  }
  for (const k of tritypeLookupKeys(centers)) {
    keys.add(k);
    const sorted = tritypeSortedFromCode(k);
    if (sorted) keys.add(sorted);
  }
  keys.add(tritypeSortedKey(centers));
  return [...keys];
}

/** 变体键：体→心→脑 顺序（如 748），与资料库 variants 一致 */
function variantKeysToTry(
  centers: ReportFacts['centers'],
  layout: TriangleLayout,
  coreType?: number
): string[] {
  const keys = new Set<string>([
    tritypeCenterOrderKey(centers),
    variantLayoutKey(layout),
  ]);
  if (coreType) {
    const types = [centers.body.type, centers.heart.type, centers.head.type];
    if (types.includes(coreType)) {
      const rest = types.filter((t) => t !== coreType);
      keys.add(`${coreType}${rest[0]}${rest[1]}`);
      keys.add(`${coreType}${rest[1]}${rest[0]}`);
    }
  }
  return [...keys];
}

/** 按三型组 + 变体排列查 81 变体文案 */
export function lookupTritypeVariantInGroup(
  tritypeGroup: string,
  variantKey: string
): TritypeVariantEntry | undefined {
  const group = findGroup(tritypeGroup);
  if (!group) return undefined;
  return group.variants[variantKey];
}

/** 尝试多种组键与变体键（748 主型 → 组 478、变体 748） */
export function lookupTritypeVariantForCenters(
  centers: ReportFacts['centers'],
  layout: TriangleLayout,
  tritypeHint?: string,
  coreType?: number
): TritypeVariantEntry | undefined {
  const variantKeys = variantKeysToTry(centers, layout, coreType);
  for (const groupKey of groupKeysForLookup(centers, tritypeHint)) {
    for (const variantKey of variantKeys) {
      const entry = lookupTritypeVariantInGroup(groupKey, variantKey);
      if (entry) return entry;
    }
  }
  return undefined;
}
