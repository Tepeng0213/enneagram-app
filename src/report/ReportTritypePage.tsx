import { useMemo } from 'react';
import { buildTritypeDiagram } from '../lib/tritype';
import type { ReportFacts } from '../types/report';
import { standardReportPageHeaderProps } from '../lib/reportPageHeader';
import { ReportPageHeader } from './ReportPageHeader';
import { ReportPageFooter } from './ReportPageFooter';
import { PpapTritypeTriangle } from './PpapTritypeTriangle';
import { PpapTritypeTraitsTable } from './PpapTritypeTraitsTable';
import { PpapSelfApplication } from './PpapSelfApplication';
import { PpapTritypeDetailSection } from './PpapTritypeDetailSection';

interface Props {
  facts: ReportFacts;
}

/** 报告第 4 页：三中心三角关系图（27 种映射） */
export function ReportTritypePage({ facts }: Props) {
  const diagram = useMemo(() => buildTritypeDiagram(facts), [facts]);

  return (
    <article className="report-page report-tritype" aria-label="三中心三角关系">
      <ReportPageHeader {...standardReportPageHeaderProps(facts)} />

      <section className="report-tritype__block">
        <div className="report-ppap__section-bar">
          <span className="report-ppap__section-bullet" aria-hidden>
            ■
          </span>
          <span className="report-ppap__section-title">PPAP</span>
          <span className="report-ppap__section-subtitle">综合结果报告摘要</span>
        </div>

        <div className="report-tritype__panel">
          {diagram ? (
            <>
              <PpapTritypeTriangle data={diagram} />
              <PpapTritypeTraitsTable coreType={facts.coreType} />
            </>
          ) : (
            <p className="report-tritype__missing">
              未找到三型组合（行动 {facts.centers.body.type} · 情感{' '}
              {facts.centers.heart.type} · 思维 {facts.centers.head.type}，查表键{' '}
              {facts.tritype}）的映射文案，请检查 tritypeMapping.json。
            </p>
          )}
          <PpapSelfApplication />
          {diagram ? (
            <PpapTritypeDetailSection
              centers={facts.centers}
              layout={diagram.layout}
              tritypeHint={diagram.tritype}
              coreType={facts.coreType}
            />
          ) : null}
        </div>
      </section>

      <ReportPageFooter compact />
    </article>
  );
}
