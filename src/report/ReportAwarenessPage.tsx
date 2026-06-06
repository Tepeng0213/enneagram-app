import type { ReportFacts } from '../types/report';
import { standardReportPageHeaderProps } from '../lib/reportPageHeader';
import { ReportPageHeader } from './ReportPageHeader';
import { ReportPageFooter } from './ReportPageFooter';
import { IcebergRatioModule } from './IcebergRatioModule';
import { ConsciousnessMapModule } from './ConsciousnessMapModule';

interface Props {
  facts: ReportFacts;
}

/** 报告第 6 页：表面/内在自我冰山 + 意识地图幸福率 */
export function ReportAwarenessPage({ facts }: Props) {
  return (
    <article className="report-page report-awareness" aria-label="觉察与意识地图分析">
      <ReportPageHeader {...standardReportPageHeaderProps(facts)} />

      <div className="report-awareness__main">
        <IcebergRatioModule facts={facts} />
        <div className="report-awareness__tail">
          <ConsciousnessMapModule />
          <div className="report-awareness__footer">
            <ReportPageFooter compact />
          </div>
        </div>
      </div>
    </article>
  );
}
