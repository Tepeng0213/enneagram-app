import {
  CHART_SCALE_MAX,
  CHART_TICKS,
  CENTER_COLORS,
  OVERVIEW_DISPLAY_ORDER,
  TYPE_OVERVIEW,
} from '../data/typeOverviewContent';
import { typeBarLabel } from '../lib/enneagramTypes';
import { standardReportPageHeaderProps } from '../lib/reportPageHeader';
import type { ReportFacts } from '../types/report';
import { ReportPageHeader } from './ReportPageHeader';
import { ReportPageFooter } from './ReportPageFooter';

interface Props {
  facts: ReportFacts;
}

export function ReportOverviewPage({ facts }: Props) {
  return (
    <article className="report-page report-overview pdf-page-break" aria-label="九型总览">
      <ReportPageHeader {...standardReportPageHeaderProps(facts)} />

      <div className="report-overview__types">
        {OVERVIEW_DISPLAY_ORDER.map((typeNum) => {
          const content = TYPE_OVERVIEW[typeNum];
          const score = facts.scores[typeNum] ?? 0;
          const barPct = Math.min(100, Math.round((score / CHART_SCALE_MAX) * 100));
          const colors = CENTER_COLORS[content.center];
          return (
            <section
              key={typeNum}
              className={`report-type-card report-type-card--${content.center}`}
            >
              <header className="report-type-card__head">
                <h3 className="report-type-card__title">
                  {content.title}
                  <span className="report-type-card__subtitle">（{content.subtitle}）</span>
                </h3>
                <p className="report-type-card__intro">{content.intro}</p>
              </header>

              <div className="report-type-card__grid">
                <aside className="report-type-card__side report-type-card__side--low">
                  <h4 className="report-type-card__side-title">分数较低时</h4>
                  <ul className="report-type-card__keywords">
                    {content.lowKeywords.map((kw) => (
                      <li key={kw}>{kw}</li>
                    ))}
                  </ul>
                </aside>

                <div className="report-type-card__chart">
                  <div className="report-type-card__chart-area">
                    <div
                      className="report-type-card__bar"
                      style={{
                        width: `${barPct}%`,
                        background: `linear-gradient(90deg, ${colors.bar}, ${colors.barDark})`,
                        backgroundColor: colors.bar,
                      }}
                    >
                      <span className="report-type-card__bar-name">{typeBarLabel(typeNum)}</span>
                      <span className="report-type-card__bar-score">{score}</span>
                    </div>
                    <div className="report-type-card__gridlines" aria-hidden>
                      {CHART_TICKS.map((tick) => (
                        <span
                          key={tick}
                          className="report-type-card__gridline"
                          style={{ left: `${(tick / CHART_SCALE_MAX) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="report-type-card__ticks" aria-hidden>
                    {CHART_TICKS.map((tick) => (
                      <span
                        key={tick}
                        className="report-type-card__tick"
                        style={{ left: `${(tick / CHART_SCALE_MAX) * 100}%` }}
                      >
                        {tick}
                      </span>
                    ))}
                  </div>
                </div>

                <aside className="report-type-card__side report-type-card__side--high">
                  <h4 className="report-type-card__side-title">分数较高时</h4>
                  <ul className="report-type-card__keywords">
                    {content.highKeywords.map((kw) => (
                      <li key={kw}>{kw}</li>
                    ))}
                  </ul>
                </aside>
              </div>
            </section>
          );
        })}
      </div>

      <ReportPageFooter compact />
    </article>
  );
}
