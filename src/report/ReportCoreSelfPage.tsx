import type { ReportFacts } from '../types/report';
import { lookupCoreSelf } from '../lib/coreSelf';
import { standardReportPageHeaderProps } from '../lib/reportPageHeader';
import { ReportPageHeader } from './ReportPageHeader';
import { ReportPageFooter } from './ReportPageFooter';
import { lookupSurfaceEgo } from '../lib/surfaceEgo';
import { PpapCoreSelfCard } from './PpapCoreSelfCard';
import { lookupInnerSelf } from '../lib/innerSelf';
import { PpapSurfaceEgoCard } from './PpapSurfaceEgoCard';
import { PpapInnerSelfCard } from './PpapInnerSelfCard';

interface Props {
  facts: ReportFacts;
}

/** 报告第 5 页：核心自我 + 表面自我 + 内在自我 */
export function ReportCoreSelfPage({ facts }: Props) {
  const coreEntry = lookupCoreSelf(facts.coreType);
  const surfaceEntry = lookupSurfaceEgo(facts.coreType);
  const innerEntry = lookupInnerSelf(facts.coreType);

  return (
    <article className="report-page report-core-self pdf-page-break" aria-label="核心自我、表面自我与内在自我">
      <ReportPageHeader {...standardReportPageHeaderProps(facts)} />

      <div className="report-core-self__main">
        {coreEntry ? (
          <PpapCoreSelfCard entry={coreEntry} />
        ) : (
          <p className="report-core-self__missing">
            未找到主型 {facts.coreType} 的核心自我文案，请检查 coreSelfTypes.json。
          </p>
        )}

        <div className="report-core-self__surface">
          {surfaceEntry ? (
            <PpapSurfaceEgoCard entry={surfaceEntry} />
          ) : (
            <p className="report-core-self__missing">
              未找到主型 {facts.coreType} 的表面自我文案，请检查 surfaceEgoTypes.json。
            </p>
          )}
        </div>

        <div className="report-core-self__inner">
          {innerEntry ? (
            <PpapInnerSelfCard entry={innerEntry} />
          ) : (
            <p className="report-core-self__missing">
              未找到主型 {facts.coreType} 的内在自我文案，请检查 innerSelfTypes.json。
            </p>
          )}
        </div>
      </div>

      <div className="report-core-self__footer">
        <ReportPageFooter compact />
      </div>
    </article>
  );
}
