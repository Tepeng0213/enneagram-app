import type { TriangleLayout } from '../lib/tritype';
import { lookupTritypeVariantForCenters } from '../lib/tritypeVariant';
import type { ReportFacts } from '../types/report';

interface Props {
  centers: ReportFacts['centers'];
  layout: TriangleLayout;
  tritypeHint?: string;
  coreType: number;
}

/** 渲染段落中的 [自我名] 与 <别名> 强调 */
function renderDetailText(text: string) {
  const parts = text.split(/(\[[^\]]+\]|<[^>]+>)/g);
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <strong key={i} className="ppap-tritype-detail__em">
          {part}
        </strong>
      );
    }
    if (part.startsWith('<') && part.endsWith('>')) {
      return (
        <strong key={i} className="ppap-tritype-detail__em">
          {part.slice(1, -1)}
        </strong>
      );
    }
    return part;
  });
}

/** 后三段：括号及括号内内容单独换行 */
function splitParenParagraph(text: string): { head: string; tail: string | null } {
  const idx = text.indexOf('（');
  if (idx <= 0) return { head: text, tail: null };
  return { head: text.slice(0, idx), tail: text.slice(idx) };
}

function DetailParagraph({ text, isLead, breakParen }: { text: string; isLead: boolean; breakParen: boolean }) {
  const className = isLead
    ? 'ppap-tritype-detail__p ppap-tritype-detail__p--lead'
    : 'ppap-tritype-detail__p';

  if (breakParen) {
    const { head, tail } = splitParenParagraph(text);
    if (tail) {
      return (
        <p className={className}>
          {renderDetailText(head)}
          <br />
          {renderDetailText(tail)}
        </p>
      );
    }
  }

  return <p className={className}>{renderDetailText(text)}</p>;
}

export function PpapTritypeDetailSection({ centers, layout, tritypeHint, coreType }: Props) {
  const variant = lookupTritypeVariantForCenters(centers, layout, tritypeHint, coreType);
  if (!variant?.detailed_description?.length) return null;

  const paragraphs = variant.detailed_description;
  const parenBreakFrom = Math.max(0, paragraphs.length - 3);

  return (
    <section className="ppap-tritype-detail" aria-label="详细说明">
      <div className="ppap-tritype-detail__title">详细说明</div>
      <div className="ppap-tritype-detail__body">
        {paragraphs.map((paragraph, index) => (
          <DetailParagraph
            key={index}
            text={paragraph}
            isLead={index === 0}
            breakParen={index >= parenBreakFrom}
          />
        ))}
      </div>
    </section>
  );
}
