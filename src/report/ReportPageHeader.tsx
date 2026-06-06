import { formatReportDate } from '../lib/formatDate';

function InsightBookLogo({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none" aria-hidden>
      <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 14h20M14 22h14M14 30h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 8l8 8-4 2-2 4-6-6 4-8z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

interface Props {
  name: string;
  testedAt: string;
  /** 第 2 页等内页顶部的 I-Book 条目标题 */
  ibookStrip?: string;
  /** 线框内主标题，默认「综合结果报告」 */
  panelTitle?: string;
  coreTypeNote?: string;
}

export function ReportPageHeader({
  name,
  testedAt,
  ibookStrip,
  panelTitle = '综合结果报告',
  coreTypeNote,
}: Props) {
  return (
    <header className="report-sheet-header-wrap">
      {ibookStrip && (
        <div className="report-sheet-header__ibook-strip">
          <span className="report-sheet-header__bullet" aria-hidden>
            ■
          </span>
          <span className="report-sheet-header__ibook-text">{ibookStrip}</span>
        </div>
      )}

      <div className="report-sheet-header">
        <div className="report-sheet-header__brand">
          <p className="report-sheet-header__brand-tag">AI 自我分析洞察书</p>
          <InsightBookLogo size={36} />
          <p className="report-sheet-header__brand-name">InsightBook</p>
        </div>

        <div className="report-sheet-header__panel">
          <div className="report-sheet-header__panel-title">{panelTitle}</div>
          <div className="report-sheet-header__panel-body">
            <p>
              <span className="report-sheet-header__bullet" aria-hidden>
                ■
              </span>
              姓名：{name || '—'}
            </p>
            <p>
              <span className="report-sheet-header__bullet" aria-hidden>
                ■
              </span>
              检测日期：{formatReportDate(testedAt)}
            </p>
            {coreTypeNote && <p className="report-sheet-header__panel-extra">{coreTypeNote}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}
