import {
  PPAP_RADAR_ORDER,
  PPAP_RADAR_REF_HIGH,
  PPAP_RADAR_REF_LOW,
  PPAP_RADAR_RING_TICKS,
  PPAP_RADAR_SCALE_MAX,
  PPAP_RADAR_SCALE_MIN,
} from '../data/ppapChart';
import { typeSelfTitleLines } from '../data/centerNarratives';
import type { ReportFacts } from '../types/report';

interface Props {
  scores: ReportFacts['scores'];
}

const N = PPAP_RADAR_ORDER.length;

/**
 * viewBox：绘图直径 −20%；标签间距在「留空」与「不压图」之间折中
 * （此前 LABEL_GAP=11 过小导致轴标与外圈/刻度重叠）
 */
const VB_WIDTH = 720;
const CX = VB_WIDTH / 2;
const MAX_R = 149; /* 186 × 0.8，保持缩小后的绘图区 */
const LABEL_GAP = 28; /* 轴标与外圈距离（约为原 42 的 2/3） */
const LABEL_R = MAX_R + LABEL_GAP;
/** 12 点方向略外移，与刻度 50 错开 */
const LABEL_R_TOP = LABEL_R + 8;
const TOP_CHART_MARGIN = LABEL_R_TOP + 16 - MAX_R; /* 保证 8 号两行标签不顶出画布 */
const CY = TOP_CHART_MARGIN + MAX_R;
const VB_HEIGHT = CY + LABEL_R + 30;
/** 刻度数字贴在 12 点钟径向轴左侧（对齐样例） */
const SCALE_LABEL_X = CX - 5;

function angleAt(index: number): number {
  return -Math.PI / 2 + (index * 2 * Math.PI) / N;
}

export function ScoreRadarChart({ scores }: Props) {
  const types = PPAP_RADAR_ORDER;
  const values = types.map((t) => scores[t] ?? 0);
  const refHigh = types.map(() => PPAP_RADAR_REF_HIGH);
  const refLow = types.map(() => PPAP_RADAR_REF_LOW);

  const radiusFor = (value: number) => {
    const clamped = Math.max(PPAP_RADAR_SCALE_MIN, Math.min(PPAP_RADAR_SCALE_MAX, value));
    const t = (clamped - PPAP_RADAR_SCALE_MIN) / (PPAP_RADAR_SCALE_MAX - PPAP_RADAR_SCALE_MIN);
    return t * MAX_R;
  };

  const polar = (angle: number, radius: number) => ({
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  });

  const polygonPoints = (vals: number[]) =>
    vals
      .map((v, i) => {
        const p = polar(angleAt(i), radiusFor(v));
        return `${p.x},${p.y}`;
      })
      .join(' ');

  const north = -Math.PI / 2;

  return (
    <div className="score-radar-chart">
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="score-radar-chart__svg"
        role="img"
        aria-label="九型分数雷达图"
      >
        {/* 同心圆网格 */}
        {PPAP_RADAR_RING_TICKS.map((tick) => (
          <circle
            key={tick}
            cx={CX}
            cy={CY}
            r={radiusFor(tick)}
            className="score-radar-chart__ring"
          />
        ))}

        {/* 九条径向轴 */}
        {types.map((t, i) => {
          const end = polar(angleAt(i), MAX_R);
          return (
            <line
              key={t}
              x1={CX}
              y1={CY}
              x2={end.x}
              y2={end.y}
              className="score-radar-chart__spoke"
            />
          );
        })}

        {/* 刻度：沿 8 号轴（12 点方向）由内向外 15→50，紧贴纵轴左侧 */}
        {PPAP_RADAR_RING_TICKS.map((tick) => {
          const y = polar(north, radiusFor(tick)).y;
          return (
            <g key={`scale-${tick}`}>
              <line
                x1={CX - 3}
                y1={y}
                x2={CX + 3}
                y2={y}
                className="score-radar-chart__scale-tick"
              />
              <text
                x={SCALE_LABEL_X}
                y={y + 4}
                textAnchor="end"
                className="score-radar-chart__scale"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* 参考区：偏低（红虚线）、偏高（绿虚线） */}
        <polygon points={polygonPoints(refLow)} className="score-radar-chart__ref-low" />
        <polygon points={polygonPoints(refHigh)} className="score-radar-chart__ref-high" />

        {/* 受测者分数（蓝实线） */}
        <polygon points={polygonPoints(values)} className="score-radar-chart__data" />

        {/* 轴标签 */}
        {types.map((t, i) => {
          const labelR = i === 0 ? LABEL_R_TOP : LABEL_R;
          const pos = polar(angleAt(i), labelR);
          const { typeLine, selfLine } = typeSelfTitleLines(t);
          return (
            <text
              key={`label-${t}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              className="score-radar-chart__label"
            >
              <tspan x={pos.x} dy="-5">
                {typeLine}
              </tspan>
              <tspan x={pos.x} dy="9">
                {selfLine}
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
