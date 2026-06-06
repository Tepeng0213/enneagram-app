import stressDimensions from '../data/stressDimensions.json';
import stressQuestions from '../data/stressQuestions.json';
import { stressAnswerLabel } from '../lib/stressScale';
import type { ReportFacts } from '../types/report';

interface Props {
  facts: ReportFacts;
}

const questionText = new Map(stressQuestions.map((q) => [q.id, q.text]));

type Dimension = (typeof stressDimensions)[number];

function DimensionBlock({
  dimension,
  answers,
}: {
  dimension: Dimension;
  answers: ReportFacts['stressAnswers'];
}) {
  return (
    <section className="stress-dim" aria-labelledby={`stress-dim-${dimension.id}`}>
      <div className="stress-dim__head">
        <h3 className="stress-dim__title" id={`stress-dim-${dimension.id}`}>
          {dimension.title}
        </h3>
        <p className="stress-dim__desc">{dimension.description}</p>
      </div>
      <ul className="stress-dim__list">
        {dimension.questionIds.map((qId) => {
          const score = answers?.[qId];
          const label = stressAnswerLabel(score);
          return (
            <li key={qId} className="stress-dim__item">
              <span className="stress-dim__bullet" aria-hidden>
                ■
              </span>
              <span className="stress-dim__statement">{questionText.get(qId) ?? `题 ${qId}`}</span>
              <span className="stress-dim__answer" aria-label={`作答：${label}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** 第 7 页 · 五维度压力测试作答回顾 */
export function StressDimensionsModule({ facts }: Props) {
  return (
    <div className="stress-dims" aria-label="压力测试作答">
      {(stressDimensions as Dimension[]).map((dim) => (
        <DimensionBlock key={dim.id} dimension={dim} answers={facts.stressAnswers} />
      ))}
    </div>
  );
}
