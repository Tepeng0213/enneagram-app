import type { ReportFacts } from '../types/report';
import { standardReportPageHeaderProps } from '../lib/reportPageHeader';
import { ReportPageHeader } from './ReportPageHeader';
import { ReportPageFooter } from './ReportPageFooter';
import { StressIntroModule } from './StressIntroModule';
import { StressFlowDiagram } from './StressFlowDiagram';
import { StressDimensionsModule } from './StressDimensionsModule';

interface Props {
  facts: ReportFacts;
}

/** 报告第 7 页：压力应对（跳过第 6 页） */
export function ReportStressPage({ facts }: Props) {
  return (
    <article className="report-page report-stress pdf-page-break" aria-label="压力应对方向">
      <ReportPageHeader {...standardReportPageHeaderProps(facts)} />

      <div className="report-stress__main">
        <StressIntroModule />
        <StressFlowDiagram />
        <StressDimensionsModule facts={facts} />
      </div>

      <div className="report-stress__footer">
        <ReportPageFooter compact />
      </div>
    </article>
  );
}
