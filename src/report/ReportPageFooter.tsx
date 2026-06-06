interface Props {
  /** 内页（第 2–4 页）使用略紧凑字号 */
  compact?: boolean;
}

const LEGAL_ZH =
  'INSIGHTBOOK 报告的版权归版权所有者所有，严禁以任何形式发布、传播报告的部分或全部内容。';
const LEGAL_EN = 'Copyright © 2024 MnS Co., Ltd. All Rights Reserved.';

export function ReportPageFooter({ compact = false }: Props) {
  return (
    <footer
      className={`report-page-footer${compact ? ' report-page-footer--compact' : ''}`}
      aria-label="版权说明"
    >
      <div className="report-page-footer__brand" aria-hidden>
        <span className="report-page-footer__brand-line">INSIGHT</span>
        <span className="report-page-footer__brand-line">BOOK</span>
      </div>
      <span className="report-page-footer__divider" aria-hidden />
      <div className="report-page-footer__legal">
        <p>{LEGAL_ZH}</p>
        <p>{LEGAL_EN}</p>
      </div>
    </footer>
  );
}
