import { inlineImages } from './reportPdf';

/** 打印文档基准 URL，确保 blob/iframe 内相对路径可解析 */
function printBaseHref(): string {
  const base = import.meta.env.BASE_URL || '/';
  return new URL(base, window.location.origin).href;
}

/** 收集当前页样式（链接转为绝对路径） */
function collectHeadMarkup(): string {
  const parts: string[] = [];
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => {
    if (el instanceof HTMLLinkElement && el.href) {
      const link = el.cloneNode(false) as HTMLLinkElement;
      link.href = el.href;
      parts.push(link.outerHTML);
    } else {
      parts.push(el.outerHTML);
    }
  });
  return parts.join('\n');
}

function waitForStyles(doc: Document): Promise<void> {
  const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
  if (!links.length) return Promise.resolve();
  return Promise.all(
    links.map(
      (link) =>
        new Promise<void>((resolve) => {
          const el = link as HTMLLinkElement;
          if (el.sheet) {
            resolve();
            return;
          }
          el.addEventListener('load', () => resolve(), { once: true });
          el.addEventListener('error', () => resolve(), { once: true });
        })
    )
  ).then(() => undefined);
}

function waitForImages(doc: Document): Promise<void> {
  const images = Array.from(doc.images);
  const pending = images.filter((img) => !img.complete);
  if (!pending.length) return Promise.resolve();
  return Promise.all(
    pending.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        })
    )
  ).then(() => undefined);
}

/**
 * 在独立 iframe 中打印报告，避免地址栏 URL 写入页脚，并内联图片保证 PDF 中正常显示。
 */
export async function printReport(): Promise<void> {
  const report = document.querySelector('.report-document');
  if (!report) return;

  const clone = report.cloneNode(true) as HTMLElement;
  await inlineImages(clone);

  const baseHref = printBaseHref();
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <base href="${baseHref}" />
  <title>INSIGHT BOOK</title>
  ${collectHeadMarkup()}
  <style>
    @page { size: A4; margin: 0; }
    html, body { margin: 0; padding: 0; background: #fff; }
    body.report-print-root { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body class="report-print-root">${clone.outerHTML}</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.setAttribute(
    'style',
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden'
  );
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  if (!win) {
    iframe.remove();
    return;
  }

  const cleanup = () => {
    iframe.remove();
    win.removeEventListener('afterprint', cleanup);
  };
  win.addEventListener('afterprint', cleanup);

  const doc = win.document;
  doc.open();
  doc.write(html);
  doc.close();

  await waitForStyles(doc);
  await inlineImages(doc.body);
  await waitForImages(doc);
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  win.focus();
  win.print();
}
