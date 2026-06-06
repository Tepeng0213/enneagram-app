import { PPAP_CHART_Y_MAX, PPAP_CHART_Y_TICKS, PPAP_LINE_CHART_ORDER } from '../data/ppapChart';
import { typeLabel } from '../lib/enneagramTypes';
import type { ReportFacts } from '../types/report';

interface Props {
  scores: ReportFacts['scores'];
}

export function ScoreLineChart({ scores }: Props) {
  const types = PPAP_LINE_CHART_ORDER;
  const values = types.map((t) => scores[t] ?? 0);

  const width = 680;
  const height = 210;
  const pad = { top: 26, right: 16, bottom: 34, left: 32 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xAt = (i: number) => pad.left + (i / (types.length - 1)) * plotW;
  const yAt = (v: number) => pad.top + plotH - (v / PPAP_CHART_Y_MAX) * plotH;
  const baselineY = yAt(0);
  const labelY = baselineY + 12;

  const points = values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ');

  return (
    <div className="score-line-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="score-line-chart__svg"
        role="img"
        aria-label="九型分数折线图"
      >
        {/* 5～45 分浅灰网格 */}
        {PPAP_CHART_Y_TICKS.filter((t) => t > 0).map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              y1={yAt(tick)}
              x2={width - pad.right}
              y2={yAt(tick)}
              className="score-line-chart__grid-h"
            />
            <text x={pad.left - 6} y={yAt(tick) + 3} textAnchor="end" className="score-line-chart__axis-y">
              {tick}
            </text>
          </g>
        ))}

        {/* 0 分横轴基线（对齐样例） */}
        <line
          x1={pad.left}
          y1={baselineY}
          x2={width - pad.right}
          y2={baselineY}
          className="score-line-chart__baseline"
        />
        <text x={pad.left - 6} y={baselineY + 3} textAnchor="end" className="score-line-chart__axis-y">
          0
        </text>

        {/* 折线 */}
        <polyline points={points} className="score-line-chart__line" fill="none" />

        {/* 数据点与分数 */}
        {values.map((v, i) => (
          <g key={types[i]}>
            <circle cx={xAt(i)} cy={yAt(v)} r={4} className="score-line-chart__dot" />
            <text x={xAt(i)} y={yAt(v) - 10} textAnchor="middle" className="score-line-chart__value">
              {v}
            </text>
          </g>
        ))}

        {/* X 轴类型名（紧贴 0 分线下方） */}
        {types.map((t, i) => (
          <text
            key={t}
            x={xAt(i)}
            y={labelY}
            textAnchor="middle"
            className="score-line-chart__axis-x"
          >
            <tspan x={xAt(i)} dy="0">
              {t}号
            </tspan>
            <tspan x={xAt(i)} dy="9">
              {typeLabel(t)}
            </tspan>
          </text>
        ))}
      </svg>
    </div>
  );
}
