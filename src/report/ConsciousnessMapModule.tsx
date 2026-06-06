import {
  CONSCIOUSNESS_MAP_FOOTNOTE_FORCE,
  CONSCIOUSNESS_MAP_FOOTNOTE_POWER,
  CONSCIOUSNESS_MAP_FORCE_DESC,
  CONSCIOUSNESS_MAP_POWER_DESC,
  consciousnessMapData,
  FORCE_ZONE_ROWS,
  POWER_ZONE_ROWS,
  type ConsciousnessMapRow,
} from '../data/consciousnessMapData';

/** 勇气行索引（Power 区最后一行，0-based） */
const COURAGE_INDEX = POWER_ZONE_ROWS - 1;
const FIRST_FORCE_INDEX = POWER_ZONE_ROWS;
/** Power 侧栏 rowspan：勇气行之前共 8 行 */
const POWER_RAIL_SPAN = COURAGE_INDEX;

function UnifiedMapRow({
  row,
  index,
  highlightLux,
}: {
  row: ConsciousnessMapRow;
  index: number;
  highlightLux?: string;
}) {
  const isThreshold = row.lux === '200';
  const isHighlight = highlightLux != null && row.lux === highlightLux;
  const isFirstPower = index === 0;
  const isCourage = index === COURAGE_INDEX;
  const isFirstForce = index === FIRST_FORCE_INDEX;

  const rowClass = [
    'consciousness-map__row',
    `consciousness-map__row--${row.zone}`,
    isThreshold ? 'consciousness-map__row--threshold' : '',
    isHighlight ? 'consciousness-map__row--highlight' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={rowClass}>
      {isFirstPower && (
        <td
          rowSpan={POWER_RAIL_SPAN}
          className="consciousness-map__rail-cell consciousness-map__rail-cell--power"
        >
          <span className="consciousness-map__zone-label">Power</span>
          <span className="consciousness-map__zone-arrow">↑</span>
        </td>
      )}
      {isCourage && <td className="consciousness-map__rail-cell consciousness-map__rail-cell--threshold" />}
      {isFirstForce && (
        <td
          rowSpan={FORCE_ZONE_ROWS}
          className="consciousness-map__rail-cell consciousness-map__rail-cell--force"
        >
          <span className="consciousness-map__zone-arrow">↓</span>
          <span className="consciousness-map__zone-label">Force</span>
        </td>
      )}

      <td className="consciousness-map__cell consciousness-map__cell--lux">{row.lux}</td>
      <td className="consciousness-map__cell consciousness-map__cell--level">
        <span className="consciousness-map__level-name">{row.level}</span>
      </td>
      <td className="consciousness-map__cell">{row.emotion}</td>
      <td className="consciousness-map__cell">{row.action}</td>

      {isFirstPower && (
        <td
          rowSpan={POWER_RAIL_SPAN}
          className="consciousness-map__note-cell consciousness-map__note-cell--power"
        >
          <p>{CONSCIOUSNESS_MAP_POWER_DESC}</p>
        </td>
      )}
      {isCourage && <td className="consciousness-map__note-cell consciousness-map__note-cell--threshold" />}
      {isFirstForce && (
        <td
          rowSpan={FORCE_ZONE_ROWS}
          className="consciousness-map__note-cell consciousness-map__note-cell--force"
        >
          <p>{CONSCIOUSNESS_MAP_FORCE_DESC}</p>
        </td>
      )}
    </tr>
  );
}

function HappinessRow({
  row,
  highlightLux,
}: {
  row: ConsciousnessMapRow;
  highlightLux?: string;
}) {
  const isHighlight = highlightLux != null && row.lux === highlightLux;
  const isThreshold = row.lux === '200';
  return (
    <tr
      className={[
        'consciousness-map__row',
        `consciousness-map__row--${row.zone}`,
        isThreshold ? 'consciousness-map__row--threshold' : '',
        isHighlight ? 'consciousness-map__row--highlight' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <td className="consciousness-map__cell consciousness-map__cell--level-sm">
        <span className="consciousness-map__level-name">{row.level}</span>
      </td>
      <td className="consciousness-map__cell consciousness-map__cell--lux-sm">{row.lux}</td>
      <td className="consciousness-map__cell consciousness-map__cell--happy">{row.happiness}</td>
    </tr>
  );
}

interface Props {
  /** 后续算分高亮用户所在 LUX 行，静态阶段可不传 */
  highlightLux?: string;
}

/** 第 6 页下半：意识地图 | 幸福率分析（静态框架） */
export function ConsciousnessMapModule({ highlightLux }: Props) {
  return (
    <section className="consciousness-map" aria-label="意识地图与幸福率分析">
      <div className="consciousness-map__frame">
        <h2 className="consciousness-map__legend">我的意识地图 | 幸福率分析结果</h2>

        <div className="consciousness-map__body">
          <div className="consciousness-map__main">
            <table className="consciousness-map__table consciousness-map__table--unified">
              <thead>
                <tr>
                  <th scope="col" className="consciousness-map__col-rail" />
                  <th scope="col">LUX</th>
                  <th scope="col">意识层级</th>
                  <th scope="col">情感</th>
                  <th scope="col">行动</th>
                  <th scope="col" className="consciousness-map__col-note" />
                </tr>
              </thead>
              <tbody>
                {consciousnessMapData.map((row, index) => (
                  <UnifiedMapRow
                    key={row.lux}
                    row={row}
                    index={index}
                    highlightLux={highlightLux}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="consciousness-map__bridge" aria-hidden>
            <svg viewBox="0 0 24 48" className="consciousness-map__bridge-svg">
              <path d="M2 24 L18 24 M14 18 L22 24 L14 30" fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="consciousness-map__happiness">
            <table className="consciousness-map__table consciousness-map__table--happy">
              <thead>
                <tr>
                  <th scope="col">意识层级</th>
                  <th scope="col">LOG</th>
                  <th scope="col">幸福率(%)</th>
                </tr>
              </thead>
              <tbody>
                {consciousnessMapData.map((row) => (
                  <HappinessRow key={`happy-${row.lux}`} row={row} highlightLux={highlightLux} />
                ))}
              </tbody>
            </table>
            <p className="consciousness-map__caption consciousness-map__caption--happy">
              〈意识层级与幸福率(%)的关系〉
            </p>
          </div>
        </div>

        <div className="consciousness-map__footnotes">
          <p>{CONSCIOUSNESS_MAP_FOOTNOTE_POWER}</p>
          <p>{CONSCIOUSNESS_MAP_FOOTNOTE_FORCE}</p>
        </div>
        <p className="consciousness-map__caption consciousness-map__caption--map">
          〈大卫·霍金斯博士的「意识地图」〉
        </p>
      </div>
    </section>
  );
}
