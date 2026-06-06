import coreSelfData from '../data/coreSelfTypes.json';

export interface CoreSelfEntry {
  core_type: string;
  core_name: string;
  quote: string;
  quote_author: string;
  core_description: string;
  tags: string[];
}

const ENTRIES = coreSelfData as CoreSelfEntry[];

export function lookupCoreSelf(coreType: number): CoreSelfEntry | undefined {
  const n = Number(coreType);
  if (!n) return undefined;
  return ENTRIES.find((e) => Number(e.core_type) === n);
}
