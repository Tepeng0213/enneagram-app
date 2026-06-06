import { useEffect, useState } from 'react';
import { factsFromSummaryRow } from './lib/buildReportFacts';
import { fetchSummaryRow, getReportTestRow, isSheetApiConfigured } from './lib/sheetApi';
import type { ReportFacts } from './types/report';
import { ReportDocument } from './report/ReportDocument';
import { printReport } from './lib/printReport';
import './report/report.css';

function parseReportRow(): number {
  const hash = window.location.hash;
  const qi = hash.indexOf('?');
  if (qi >= 0) {
    const row = new URLSearchParams(hash.slice(qi)).get('row');
    if (row) return Number(row);
  }
  const m = hash.match(/#\/report\/(\d+)/);
  if (m) return Number(m[1]);
  return 0;
}

export default function ReportView() {
  const row = parseReportRow();
  const [facts, setFacts] = useState<ReportFacts | null>(null);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ok' | 'err'>('loading');
  const [loadMessage, setLoadMessage] = useState('');

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'INSIGHT BOOK';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const effectiveRow = row >= 2 ? row : getReportTestRow();

      if (!effectiveRow || effectiveRow < 2) {
        setLoadStatus('err');
        setLoadMessage('请从「洞察报告列表」选择一份报告');
        setFacts(null);
        return;
      }

      if (!isSheetApiConfigured()) {
        setLoadStatus('err');
        setLoadMessage('未配置表格接口');
        return;
      }

      setLoadStatus('loading');
      const res = await fetchSummaryRow(effectiveRow);
      if (cancelled) return;

      if (res.ok && res.data) {
        setFacts(factsFromSummaryRow(res.row ?? effectiveRow, res.data));
        setLoadStatus('ok');
        const tag = effectiveRow === getReportTestRow() ? '（测试样例）' : '';
        setLoadMessage(`${res.data.name}${tag}`);
      } else {
        setFacts(null);
        setLoadStatus('err');
        setLoadMessage(res.error || '读取失败');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [row]);

  return (
    <div className="report-shell">
      <div className="report-shell__toolbar">
        <span className="report-shell__badge">洞察报告 · 第 1–7 页</span>
        <a href="#/reports">← 报告列表</a>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.85rem', marginLeft: 'auto' }}
          onClick={() => void printReport()}
          disabled={!facts}
        >
          打印 / 存 PDF
        </button>
      </div>

      {loadStatus === 'loading' && <p className="report-shell__status">正在加载…</p>}
      {loadMessage && loadStatus !== 'loading' && (
        <p
          className={`report-shell__status ${loadStatus === 'err' ? 'report-shell__status--err' : ''}`}
        >
          {loadMessage}
        </p>
      )}

      {facts && <ReportDocument facts={facts} />}
    </div>
  );
}
