import { useMemo } from 'react';
import { buildCenterColumns } from '../lib/centerNarratives';
import type { ReportFacts } from '../types/report';
import { ReportPageHeader } from './ReportPageHeader';
import { ReportPageFooter } from './ReportPageFooter';
import { PpapCentersRow } from './PpapCentersRow';
import { ScoreLineChart } from './ScoreLineChart';
import { ScoreRadarChart } from './ScoreRadarChart';
import { standardReportPageHeaderProps } from '../lib/reportPageHeader';

interface Props {
  facts: ReportFacts;
}

/** 报告第 3 页：PPAP 摘要（页头 + 折线图 + 三中心 + 雷达图） */
export function ReportPpapPage({ facts }: Props) {
  const centerCols = useMemo(() => buildCenterColumns(facts), [facts]);

  return (
    <article className="report-page report-ppap" aria-label="PPAP综合摘要">
      <ReportPageHeader {...standardReportPageHeaderProps(facts)} />

      <section className="report-ppap__chart-block">
        <div className="report-ppap__section-bar">
          <span className="report-ppap__section-bullet" aria-hidden>
            ■
          </span>
          <span className="report-ppap__section-title">PPAP</span>
          <span className="report-ppap__section-subtitle">综合结果报告摘要</span>
        </div>

        <div className="report-ppap__chart-panel">
          <ScoreLineChart scores={facts.scores} />
          <PpapCentersRow columns={centerCols} />
          <ScoreRadarChart scores={facts.scores} />
        </div>
      </section>

      <ReportPageFooter compact />
    </article>
  );
}
