import { createRoot, type Root } from 'react-dom/client';
import { createElement } from 'react';
import { factsFromSummaryRow } from './buildReportFacts';
import { exportReportPdfBlob } from './reportPdf';
import { fetchSummaryRow, uploadReportPdf, type UploadReportPdfResponse } from './sheetApi';
import { ReportDocument } from '../report/ReportDocument';

async function renderReportElement(row: number): Promise<{ host: HTMLDivElement; root: Root; element: HTMLElement }> {
  const res = await fetchSummaryRow(row);
  if (!res.ok || !res.data) {
    throw new Error(res.error || '读取汇总表失败');
  }

  const facts = factsFromSummaryRow(res.row ?? row, res.data);
  const host = document.createElement('div');
  host.className = 'report-pdf-render-host';
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText =
    'position:fixed;left:-12000px;top:0;width:210mm;opacity:0;pointer-events:none;overflow:hidden;';
  document.body.appendChild(host);

  const mount = document.createElement('div');
  host.appendChild(mount);

  const root = createRoot(mount);
  root.render(createElement(ReportDocument, { facts }));

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 150);
    });
  });

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const images = Array.from(host.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        })
    )
  );

  const element = host.querySelector('.report-document');
  if (!(element instanceof HTMLElement)) {
    root.unmount();
    host.remove();
    throw new Error('报告渲染失败');
  }

  return { host, root, element };
}

function cleanupRender(host: HTMLDivElement, root: Root) {
  root.unmount();
  host.remove();
}

/** 测试提交成功后：生成完整 7 页 PDF 并上传到 Google 云端硬盘 profigram 文件夹 */
export async function generateAndUploadReportPdf(row: number): Promise<UploadReportPdfResponse> {
  let host: HTMLDivElement | null = null;
  let root: Root | null = null;

  try {
    const rendered = await renderReportElement(row);
    host = rendered.host;
    root = rendered.root;

    const blob = await exportReportPdfBlob(rendered.element);
    const res = await fetchSummaryRow(row);
    const name = res.data?.name || '未命名';
    const testedAt = res.data?.timestamp || '';

    return await uploadReportPdf(row, blob, name, testedAt);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  } finally {
    if (host && root) {
      cleanupRender(host, root);
    }
  }
}
