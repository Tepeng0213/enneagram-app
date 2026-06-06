/** 第 7 页 · 模块 2：恐惧/欲望 → 自我 → 压力应对能力 → 健康/不健康 */
export function StressFlowDiagram() {
  const mutedFill = '#ececec';
  const teal = '#2a6674';
  const textDark = '#333';

  const coreR = 62;
  const smallR = 46;
  const midY = 134;
  /** 健康 / 不健康 间距 = 自我（深青）圆直径的 2/3 */
  const outcomeGap = (2 / 3) * (coreR * 2);
  const outcomeCenterDist = smallR * 2 + outcomeGap;
  const healthCy = midY - outcomeCenterDist / 2;
  const unhealthyCy = midY + outcomeCenterDist / 2;
  const svgHeight = midY + outcomeCenterDist / 2 + smallR + 8;

  return (
    <section className="stress-flow" aria-label="压力应对能力示意">
      <svg
        className="stress-flow__svg"
        viewBox={`0 0 760 ${svgHeight}`}
        role="img"
        aria-labelledby="stress-flow-title"
      >
        <title id="stress-flow-title">恐惧与欲望经自我影响压力应对能力，分为健康与不健康</title>

        {/* 恐惧 · 欲望 */}
        <circle cx="72" cy={midY} r={smallR} fill={mutedFill} />
        <text x="72" y={midY + 5} className="stress-flow__label" fill={textDark}>
          恐惧
        </text>
        <circle cx="158" cy={midY} r={smallR} fill={mutedFill} />
        <text x="158" y={midY + 5} className="stress-flow__label" fill={textDark}>
          欲望
        </text>

        {/* >> */}
        <text x="228" y={midY + 8} className="stress-flow__chevron" fill={teal}>
          &gt;&gt;
        </text>

        {/* 自我 */}
        <circle cx="318" cy={midY} r={coreR} fill={teal} />
        <text x="318" y={midY + 8} className="stress-flow__label stress-flow__label--core">
          自我
        </text>

        {/* 分叉原点 */}
        <circle cx="404" cy={midY} r="4.5" fill={teal} />

        {/* 分叉：从圆点直接分两路 */}
        <path
          d={`M 404 ${midY} L 528 ${healthCy}`}
          fill="none"
          stroke={teal}
          strokeWidth="2.2"
          markerEnd="url(#stress-flow-arrow)"
        />
        <path
          d={`M 404 ${midY} L 528 ${unhealthyCy}`}
          fill="none"
          stroke={teal}
          strokeWidth="2.2"
          markerEnd="url(#stress-flow-arrow)"
        />

        {/* 压力 / 应对能力（嵌在分叉开口内） */}
        <text x="428" y={midY} className="stress-flow__branch-label" fill={teal}>
          <tspan x="428" dy="-0.55em">
            压力
          </tspan>
          <tspan x="428" dy="1.15em">
            应对能力
          </tspan>
        </text>

        {/* 健康 · 不健康 */}
        <circle cx="582" cy={healthCy} r={smallR} fill={mutedFill} />
        <text x="582" y={healthCy + 5} className="stress-flow__label" fill={textDark}>
          健康
        </text>
        <circle cx="582" cy={unhealthyCy} r={smallR} fill={mutedFill} />
        <text x="582" y={unhealthyCy + 5} className="stress-flow__label" fill={textDark}>
          不健康
        </text>

        <defs>
          <marker
            id="stress-flow-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={teal} />
          </marker>
        </defs>
      </svg>
    </section>
  );
}
