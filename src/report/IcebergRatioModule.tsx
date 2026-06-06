import type { ReportFacts } from '../types/report';
import {
  buildSurfaceInnerEvaluation,
  computeSurfaceInnerEgo,
  splitEvaluationHighlights,
} from '../lib/surfaceInnerEgo';
import { IcebergIllustration } from './IcebergIllustration';

interface Props {
  facts: ReportFacts;
}

function PercentStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="iceberg-ratio__stat">
      <span className="iceberg-ratio__stat-label">{label}</span>
      <p className="iceberg-ratio__stat-value">
        <span className="iceberg-ratio__stat-num">{value}</span>
        <span className="iceberg-ratio__stat-pct">%</span>
      </p>
    </div>
  );
}

/** 第 6 页 · 表面自我 / 内在自我 冰山比例（约占 A4 半页） */
export function IcebergRatioModule({ facts }: Props) {
  const { surfaceEgo, innerEgo } = computeSurfaceInnerEgo(facts.stressAnswers);
  const evaluation = buildSurfaceInnerEvaluation(surfaceEgo);
  const evalParts = splitEvaluationHighlights(evaluation);

  return (
    <section className="iceberg-ratio" aria-label="表面自我与内在自我比例分析">
      <div className="iceberg-ratio__frame">
        <h2 className="iceberg-ratio__legend">我的表面自我 | 内在自我 比例分析</h2>

        <div className="iceberg-ratio__body">
          <div className="iceberg-ratio__left">
            <IcebergIllustration surfacePercent={surfaceEgo} innerPercent={innerEgo} />
          </div>

          <div className="iceberg-ratio__right">
            <div className="iceberg-ratio__zone iceberg-ratio__zone--surface">
              <PercentStat label="表面自我" value={surfaceEgo} />
            </div>
            <div className="iceberg-ratio__waterline" aria-hidden />
            <div className="iceberg-ratio__zone iceberg-ratio__zone--inner">
              <PercentStat label="内在自我" value={innerEgo} />
              <div className="iceberg-ratio__eval">
                <h3 className="iceberg-ratio__eval-title">综合评估</h3>
                <p className="iceberg-ratio__eval-text">
                  {evalParts.map((part, i) =>
                    part.highlight ? (
                      <span key={i} className="iceberg-ratio__eval-highlight">
                        {part.text}
                      </span>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
