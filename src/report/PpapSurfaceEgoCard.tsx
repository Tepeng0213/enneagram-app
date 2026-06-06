import type { ReactNode } from 'react';
import type { SurfaceEgoEntry } from '../lib/surfaceEgo';

interface Props {
  entry: SurfaceEgoEntry;
}

function SectionBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ppap-surface-ego__block">
      <h3 className="ppap-surface-ego__heading">{title}</h3>
      {children}
    </div>
  );
}

export function PpapSurfaceEgoCard({ entry }: Props) {
  const { defense_mechanism: defense } = entry;

  return (
    <section className="ppap-surface-ego" aria-label="表面自我">
      <div className="ppap-surface-ego__frame">
        <h2 className="ppap-surface-ego__legend">大纲(Outline) | 表面自我</h2>

        <div className="ppap-surface-ego__grid">
          <div className="ppap-surface-ego__col ppap-surface-ego__col--images">
            <h3 className="ppap-surface-ego__heading">我的自我形象是？</h3>
            <ul className="ppap-surface-ego__list">
              {entry.ego_images.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="ppap-surface-ego__col ppap-surface-ego__col--mid">
            <SectionBlock title="我的优点是？">
              <p className="ppap-surface-ego__text">{entry.strengths}</p>
            </SectionBlock>
            <SectionBlock title="我的缺点是？">
              <p className="ppap-surface-ego__text">{entry.weaknesses}</p>
            </SectionBlock>
          </div>

          <div className="ppap-surface-ego__col ppap-surface-ego__col--health">
            <SectionBlock title="健康时">
              <p className="ppap-surface-ego__text">{entry.healthy_status}</p>
            </SectionBlock>
            <SectionBlock title="不健康时">
              <p className="ppap-surface-ego__text">{entry.unhealthy_status}</p>
            </SectionBlock>
          </div>
        </div>

        <div className="ppap-surface-ego__defense">
          <span className="ppap-surface-ego__defense-label">防御机制</span>
          <p className="ppap-surface-ego__defense-text">
            <span className="ppap-surface-ego__defense-name">{defense.name}：</span>
            {defense.description}
          </p>
        </div>
      </div>
    </section>
  );
}
