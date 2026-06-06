import { useCallback, useEffect, useState } from 'react';
import { typeLabelWithNumber } from './lib/enneagramTypes';
import { formatReportDate } from './lib/formatDate';
import {
  fetchRecentReports,
  getReportTestRow,
  isSheetApiConfigured,
  type RecentReportItem,
} from './lib/sheetApi';

const RECENT_DAYS = 3;
const ARCHIVE_FOLDER_NAME = 'InsightBook 报告归档';

export default function ReportList() {
  const testRow = getReportTestRow();
  const [items, setItems] = useState<RecentReportItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ok' | 'err'>('loading');
  const [message, setMessage] = useState('');

  const loadList = useCallback(async () => {
    if (!isSheetApiConfigured()) {
      setStatus('err');
      setMessage('未配置表格接口，请在 web/.env 填写 VITE_SHEET_WEBAPP_URL 与 VITE_SHEET_API_SECRET');
      setItems([]);
      return;
    }

    setStatus('loading');
    const res = await fetchRecentReports(RECENT_DAYS, testRow);
    if (res.ok && res.items) {
      setItems(res.items);
      setStatus('ok');
      const recentCount = res.items.filter((i) => !i.isTestSample).length;
      const testCount = res.items.filter((i) => i.isTestSample).length;
      const parts: string[] = [];
      if (recentCount > 0) parts.push(`近 ${RECENT_DAYS} 天 ${recentCount} 份`);
      if (testCount > 0) parts.push(`测试样例（汇总第 ${testRow} 行）${testCount} 份`);
      setMessage(parts.length ? `共 ${res.items.length} 份：${parts.join('，')}` : `共 0 份`);
    } else {
      setStatus('err');
      setMessage(res.error || '加载失败');
      setItems([]);
    }
  }, [testRow]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  return (
    <div className="app report-admin">
      <div className="card">
        <h1>洞察报告</h1>
        <p className="sub">
          本页显示近 <strong>{RECENT_DAYS} 天</strong> 的记录，以及固定测试行{' '}
          <strong>汇总表第 {testRow} 行</strong>（用于开发预览，不受 3 天限制）。
          每次提交成功后会将 PDF 存入云端硬盘「{ARCHIVE_FOLDER_NAME}」。
        </p>

        {status === 'loading' && <p className="sub">正在加载…</p>}
        {message && status !== 'loading' && (
          <p className={`sub ${status === 'err' ? 'report-admin__err' : ''}`}>{message}</p>
        )}

        <div className="report-admin__actions">
          <button type="button" className="btn btn-secondary" onClick={loadList} disabled={status === 'loading'}>
            刷新列表
          </button>
          <a
            className="btn"
            href={`#/report?row=${testRow}`}
            style={{ textDecoration: 'none' }}
          >
            直接打开测试样例
          </a>
        </div>

        {items.length > 0 ? (
          <ul className="report-admin__list">
            {items.map((item) => (
              <li key={item.row} className="report-admin__item">
                <div className="report-admin__item-main">
                  <strong>
                    {item.name}
                    {item.isTestSample && (
                      <span className="report-admin__tag">测试样例</span>
                    )}
                  </strong>
                  <span className="report-admin__meta">
                    {formatReportDate(item.timestamp)} · {typeLabelWithNumber(item.coreType)}
                  </span>
                </div>
                <a className="btn" href={`#/report?row=${item.row}`} style={{ textDecoration: 'none' }}>
                  查看报告
                </a>
              </li>
            ))}
          </ul>
        ) : (
          status === 'ok' && (
            <div className="sub">
              <p>列表为空。请确认：</p>
              <ul style={{ paddingLeft: 20 }}>
                <li>汇总表第 {testRow} 行是否有姓名、主型等数据</li>
                <li>已重新部署最新 WebAppSubmit.gs</li>
              </ul>
              <p style={{ marginTop: 12 }}>
                也可点击上方 <strong>直接打开测试样例</strong>，按行号读取第 {testRow} 行。
              </p>
            </div>
          )
        )}

        <p className="sub report-admin__note">
          若第 {testRow} 行日期较早，不会出现在「近 3 天」里，但会以「测试样例」显示。更早 PDF 见云端硬盘
          「{ARCHIVE_FOLDER_NAME}」。
        </p>
      </div>
    </div>
  );
}
