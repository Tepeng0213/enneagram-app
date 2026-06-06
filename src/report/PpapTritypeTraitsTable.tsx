import {
  lookupCoreTypeTraits,
  TRAIT_COLUMN_LABELS,
  type TritypeTraitsEntry,
} from '../lib/tritypeTraits';

interface Props {
  coreType: number;
}

export function PpapTritypeTraitsTable({ coreType }: Props) {
  const entry = lookupCoreTypeTraits(coreType);
  if (!entry) return null;

  return (
    <div className="ppap-tritype-traits">
      <table className="ppap-tritype-traits__table">
        <caption className="ppap-tritype-traits__caption">{entry.table_title}</caption>
        <thead>
          <tr>
            {TRAIT_COLUMN_LABELS.map(({ label }) => (
              <th key={label} scope="col" className="ppap-tritype-traits__th">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <TraitsRow entry={entry} />
        </tbody>
      </table>
    </div>
  );
}

const PAREN_BREAK_KEYS = new Set<keyof TritypeTraitsEntry['traits']>([
  'to_get_what_they_want',
  'when_frustrated',
  'object_relations',
]);

/** 「标签（说明）」→ 标签与（说明）分行 */
function splitParenLine(text: string): { head: string; tail: string | null } {
  const idx = text.indexOf('（');
  if (idx <= 0) return { head: text, tail: null };
  return { head: text.slice(0, idx), tail: text.slice(idx) };
}

function TraitCellContent({
  value,
  traitKey,
}: {
  value: string;
  traitKey: keyof TritypeTraitsEntry['traits'];
}) {
  if (!PAREN_BREAK_KEYS.has(traitKey)) {
    return <>{value}</>;
  }
  const { head, tail } = splitParenLine(value);
  if (!tail) {
    return <>{value}</>;
  }
  return (
    <>
      {head}
      <br />
      {tail}
    </>
  );
}

function TraitsRow({ entry }: { entry: TritypeTraitsEntry }) {
  return (
    <tr>
      {TRAIT_COLUMN_LABELS.map(({ key }) => (
        <td key={key} className="ppap-tritype-traits__td">
          <TraitCellContent value={entry.traits[key]} traitKey={key} />
        </td>
      ))}
    </tr>
  );
}
