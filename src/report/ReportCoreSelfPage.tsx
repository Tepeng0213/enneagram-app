import type { CSSProperties } from 'react';
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

/** 第 5 页刚性 A4 物理盒：WeasyPrint / 浏览器打印均在此硬切页，溢出裁剪不挤压第 6 页 */
const CORE_SELF_PAGE_STYLE: CSSProperties = {
  width: '210mm',
  height: '297mm',
  maxWidth: '210mm',
  maxHeight: '297mm',
  boxSizing: 'border-box',
  overflow: 'hidden',
  pageBreakBefore: 'always',
  breakBefore: 'page',
  pageBreakInside: 'avoid',
  breakInside: 'avoid',
};

/** 报告第 5 页：核心自我 + 表面自我 + 内在自我 */
export function ReportCoreSelfPage({ facts }: Props) {
  const coreEntry = lookupCoreSelf(facts.coreType);
  const surfaceEntry = lookupSurfaceEgo(facts.coreType);
  const innerEntry = lookupInnerSelf(facts.coreType);

  return (
    <article
      className="report-page report-core-self"
      style={CORE_SELF_PAGE_STYLE}
      aria-label="核心自我、表面自我与内在自我"
    >
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
