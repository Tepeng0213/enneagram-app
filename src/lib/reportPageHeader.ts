import type { ReportFacts } from '../types/report';
import { typeLabelWithNumber } from './enneagramTypes';

/** 内页统一页头（图 2）参数 */
export function standardReportPageHeaderProps(facts: ReportFacts) {
  return {
    name: facts.name,
    testedAt: facts.testedAt,
    ibookStrip: 'PPAP 综合结果报告摘要' as const,
    panelTitle: '综合结果报告' as const,
    coreTypeNote: `主型：${typeLabelWithNumber(facts.coreType)}（${facts.coreScore} 分）`,
  };
}
