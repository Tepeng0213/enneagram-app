import type { ScoreResult } from '../lib/scoring';

/** 报告 facts：来自计分结果，生成时不得篡改分数 */
export interface ReportFacts {
  name: string;
  testedAt: string;
  code?: string;
  sheetRow?: number;
  scores: Record<number, number>;
  coreType: number;
  coreScore: number;
  /** 体-心-脑主型编码，如 926 */
  tritype?: string;
  /** 27 种映射别名，如「圣人」 */
  tritypeAlias?: string;
  /** 辅型（翼），用于行动中心辅助自我 */
  wingType?: number;
  centers: ScoreResult['centers'];
  /** 压力测试题 82～91 选项（1～5），来自汇总表或答卷明细 */
  stressAnswers?: Record<number, number>;
}

export interface ReportCoverData {
  name: string;
  testedAt: string;
  coreTypeLabel: string;
}
