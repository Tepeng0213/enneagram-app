import {
  CENTER_AXIS_LABELS,
  getTypeSelfNarrative,
  typeSelfTitleLines,
} from '../data/centerNarratives';
import { CENTERS, type CenterKey } from './scoring';
import type { ReportFacts } from '../types/report';

export interface CenterColumnData {
  centerKey: CenterKey;
  axisLabel: string;
  centerName: string;
  type: number;
  typeLine: string;
  selfLine: string;
  paragraph: string;
}

const CENTER_ORDER: CenterKey[] = ['body', 'heart', 'head'];

/** 从汇总表三中心主型生成三列 PPAP 文案（静态「自我」说明） */
export function buildCenterColumns(facts: ReportFacts): CenterColumnData[] {
  return CENTER_ORDER.map((centerKey) => {
    const type = facts.centers[centerKey].type;
    const { typeLine, selfLine } = typeSelfTitleLines(type);
    return {
      centerKey,
      axisLabel: CENTER_AXIS_LABELS[centerKey],
      centerName: CENTERS[centerKey].name,
      type,
      typeLine,
      selfLine,
      paragraph: getTypeSelfNarrative(type),
    };
  });
}
