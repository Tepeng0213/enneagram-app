import type { InnerSelfEntry } from '../lib/innerSelf';

interface Props {
  entry: InnerSelfEntry;
}

function ColHeading({
  label,
  variant,
}: {
  label: string;
  variant: 'accent' | 'dark' | 'black';
}) {
  return <h3 className={`ppap-inner-self__col-title ppap-inner-self__col-title--${variant}`}>{label}</h3>;
}

export function PpapInnerSelfCard({ entry }: Props) {
  return (
    <section className="ppap-inner-self" aria-label="内在自我">
      <div className="ppap-inner-self__frame">
        <h2 className="ppap-inner-self__legend">内部层级(Internal Layers) | 内在自我</h2>

        <div className="ppap-inner-self__top">
          <div className="ppap-inner-self__top-col">
            <ColHeading label="恐惧是什么？" variant="accent" />
            <p className="ppap-inner-self__subtitle">{entry.core_fear.title}</p>
            <p className="ppap-inner-self__text">{entry.core_fear.description}</p>
          </div>
          <div className="ppap-inner-self__top-col">
            <ColHeading label="欲望是什么？" variant="accent" />
            <p className="ppap-inner-self__subtitle">{entry.core_desire.title}</p>
            <p className="ppap-inner-self__text">{entry.core_desire.description}</p>
          </div>
        </div>

        <div className="ppap-inner-self__divider-h" aria-hidden />

        <div className="ppap-inner-self__bottom">
          <div className="ppap-inner-self__bottom-col">
            <ColHeading label={`核心情绪 | ${entry.core_emotion.name}`} variant="dark" />
            <p className="ppap-inner-self__text">{entry.core_emotion.description}</p>
          </div>
          <div className="ppap-inner-self__bottom-col">
            <ColHeading
              label={`行为特性 | ${entry.behavioral_traits.group_name}`}
              variant="dark"
            />
            <p className="ppap-inner-self__text">{entry.behavioral_traits.description}</p>
          </div>
          <div className="ppap-inner-self__bottom-col">
            <ColHeading label="摘要" variant="dark" />
            <p className="ppap-inner-self__subtitle">{entry.summary.title}</p>
            <p className="ppap-inner-self__text">{entry.summary.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
