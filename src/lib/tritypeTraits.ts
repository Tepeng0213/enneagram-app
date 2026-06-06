import typeTraitsData from '../data/tritypeTypeTraits.json';

export interface TritypeTypeTraits {
  energy_direction: string;
  fear: string;
  desire: string;
  characteristic: string;
  strength: string;
  weakness: string;
  to_get_what_they_want: string;
  when_frustrated: string;
  object_relations: string;
}

export interface TritypeTraitsEntry {
  table_title: string;
  traits: TritypeTypeTraits;
}

const TRAITS_BY_TYPE = typeTraitsData as Record<string, TritypeTraitsEntry>;

/** 上顶点核心型号 → 特征表（81 变体共享 9 套核心特征） */
export function lookupCoreTypeTraits(coreType: number): TritypeTraitsEntry | undefined {
  return TRAITS_BY_TYPE[String(coreType)];
}

export const TRAIT_COLUMN_LABELS: { key: keyof TritypeTypeTraits; label: string }[] = [
  { key: 'energy_direction', label: '能量方向' },
  { key: 'fear', label: '恐惧' },
  { key: 'desire', label: '欲望' },
  { key: 'characteristic', label: '特征' },
  { key: 'strength', label: '优点' },
  { key: 'weakness', label: '缺点' },
  { key: 'to_get_what_they_want', label: '为得到想要的' },
  { key: 'when_frustrated', label: '受挫时' },
  { key: 'object_relations', label: '对象关系' },
];
