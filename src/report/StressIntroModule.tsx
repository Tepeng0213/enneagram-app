/** 第 7 页 · 模块 1：压力应对方向说明（版式见样例图） */
export function StressIntroModule() {
  return (
    <section className="stress-intro" aria-label="压力应对方向">
      <div className="stress-intro__frame">
        <h2 className="stress-intro__legend">
          压力应对方向
          <span className="stress-intro__legend-sep" aria-hidden>
            {' '}
            |{' '}
          </span>
          Stress Avoidance Tendency
        </h2>
        <p className="stress-intro__text">
          该指标反映您在压力情境下如何反应与应对，由此可以把握综合的压力应对方向。同一自我类型也可能处于健康或不健康状态，压力应对方向也会有所不同，因此先确认这一方向性十分重要。
        </p>
      </div>
    </section>
  );
}
