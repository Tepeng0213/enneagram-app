import type { CoreSelfEntry } from '../lib/coreSelf';

interface Props {
  entry: CoreSelfEntry;
}

export function PpapCoreSelfCard({ entry }: Props) {
  return (
    <section className="ppap-core-self" aria-label="核心自我">
      <div className="ppap-core-self__frame">
        <h2 className="ppap-core-self__legend">自我单元(底稿) | 核心自我</h2>
        <div className="ppap-core-self__body">
          <div className="ppap-core-self__ident">
            <p className="ppap-core-self__intro">您的核心自我是</p>
            <p className="ppap-core-self__name">{entry.core_name}</p>
          </div>
          <div className="ppap-core-self__divider" aria-hidden />
          <div className="ppap-core-self__content">
            <p className="ppap-core-self__quote">
              {entry.quote}
              <span className="ppap-core-self__quote-author"> — {entry.quote_author}</span>
            </p>
            <p className="ppap-core-self__desc">{entry.core_description}</p>
            <p className="ppap-core-self__tags">{entry.tags.join('，')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
