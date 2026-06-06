import type { CenterColumnData } from '../lib/centerNarratives';

interface Props {
  columns: CenterColumnData[];
}

export function PpapCentersRow({ columns }: Props) {
  return (
    <div className="ppap-centers">
      {columns.map((col) => (
        <div key={col.centerKey} className="ppap-centers__col">
          <div className="ppap-centers__axis" aria-hidden>
            {col.axisLabel}
          </div>
          <div className="ppap-centers__content">
            <h3 className="ppap-centers__type-title">
              <span className="ppap-centers__type-line">{col.typeLine}</span>
              <span className="ppap-centers__self-line">{col.selfLine}</span>
            </h3>
            <p className="ppap-centers__paragraph">{col.paragraph}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
