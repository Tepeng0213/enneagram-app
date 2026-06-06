import { formatReportDate } from '../lib/formatDate';
import type { ReportCoverData } from '../types/report';
import { ReportPageFooter } from './ReportPageFooter';

const INTRO_HIGHLIGHT =
  'InsightBook 深入探索您内心形成的自我，具体揭示潜能的方向。细腻分析情感与思维，理解生活的复杂性，为和谐成长与自我设计提供专业洞察。';

const INTRO_PARAGRAPHS = [
  'InsightBook 是专为细致分解和分析您的情感、思想与心理体验而设计的自我探索工具。',
  '它帮助您系统把握日常中掠过的烦恼、选择的分叉、压力来源，乃至喜悦的源泉，从而探索内在动机、价值观与潜在优势，明晰职业方向与性格特质。',
  '这一过程，是将内心切成小块来面对和设计的时光。通过 InsightBook 记录的内容，您可以可视化自己的成长历程，发现反复出现的倾向与决策模式，并最终具体描绘属于自己的路线图与目标。',
  '当情感与思想被系统整理、汇聚成一份设计图的那一刻，您对未来的方向将变得更加清晰。InsightBook 将陪伴这段旅程，助您描绘更有意义的人生。',
];

interface Props {
  data: ReportCoverData;
}

export function ReportCoverPage({ data }: Props) {
  return (
    <article className="report-page report-cover pdf-page-break" aria-label="报告封面">
      <header className="report-cover__brand">
        <div className="report-cover__logo" aria-hidden>
          <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
            <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" />
            <path
              d="M14 14h20M14 22h14M14 30h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M32 8l8 8-4 2-2 4-6-6 4-8z"
              fill="currentColor"
              opacity="0.85"
            />
          </svg>
        </div>
        <h1 className="report-cover__title">INSIGHT BOOK</h1>
        <p className="report-cover__subtitle">发现我的潜能 · AI 自我分析洞察书</p>
      </header>

      <section className="report-cover__meta">
        <div className="report-cover__meta-row">
          <span className="report-cover__meta-item">
            <span className="report-cover__bullet" aria-hidden>
              ■
            </span>
            姓名：{data.name || '—'}
          </span>
          <span className="report-cover__meta-item">
            <span className="report-cover__bullet" aria-hidden>
              ■
            </span>
            检测日期：{formatReportDate(data.testedAt)}
          </span>
        </div>
        <div className="report-cover__meta-row report-cover__meta-row--single">
          <span className="report-cover__meta-item">
            <span className="report-cover__bullet" aria-hidden>
              ■
            </span>
            主型：{data.coreTypeLabel}
          </span>
        </div>
      </section>

      <p className="report-cover__highlight">{INTRO_HIGHLIGHT}</p>

      <section className="report-cover__intro-box">
        {INTRO_PARAGRAPHS.map((para, i) => (
          <p key={i}>
            {para.split(/(InsightBook)/g).map((part, j) =>
              part === 'InsightBook' ? (
                <strong key={j} className="report-cover__brand-word">
                  InsightBook
                </strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        ))}
      </section>

      <ReportPageFooter />
    </article>
  );
}
