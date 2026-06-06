import innerSelfData from '../data/innerSelfTypes.json';

export interface InnerSelfTextBlock {
  title: string;
  description: string;
}

export interface InnerSelfEntry {
  core_type: string;
  core_name: string;
  core_fear: InnerSelfTextBlock;
  core_desire: InnerSelfTextBlock;
  core_emotion: {
    name: string;
    description: string;
  };
  behavioral_traits: {
    group_name: string;
    description: string;
  };
  summary: InnerSelfTextBlock;
}

const ENTRIES = innerSelfData as InnerSelfEntry[];

export function lookupInnerSelf(coreType: number): InnerSelfEntry | undefined {
  const n = Number(coreType);
  if (!n) return undefined;
  return ENTRIES.find((e) => Number(e.core_type) === n);
}
