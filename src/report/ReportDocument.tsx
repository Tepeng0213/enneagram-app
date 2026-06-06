import type { ReportCoverData, ReportFacts } from '../types/report';
import { typeLabelWithNumber } from '../lib/enneagramTypes';
import { ReportCoverPage } from './ReportCoverPage';
import { ReportOverviewPage } from './ReportOverviewPage';
import { ReportPpapPage } from './ReportPpapPage';
import { ReportTritypePage } from './ReportTritypePage';
import { ReportCoreSelfPage } from './ReportCoreSelfPage';
import { ReportAwarenessPage } from './ReportAwarenessPage';
import { ReportStressPage } from './ReportStressPage';
import './report.css';

export function factsToCover(facts: ReportFacts): ReportCoverData {
  return {
    name: facts.name,
    testedAt: facts.testedAt,
    coreTypeLabel: typeLabelWithNumber(facts.coreType),
  };
}

interface Props {
  facts: ReportFacts;
}

/** 完整 7 页报告（在线预览与 PDF 导出共用） */
export function ReportDocument({ facts }: Props) {
  const cover = factsToCover(facts);

  return (
    <div className="report-document">
      <ReportCoverPage data={cover} />
      <ReportOverviewPage facts={facts} />
      <ReportPpapPage facts={facts} />
      <ReportTritypePage facts={facts} />
      <ReportCoreSelfPage facts={facts} />
      <ReportAwarenessPage facts={facts} />
      <ReportStressPage facts={facts} />
    </div>
  );
}
