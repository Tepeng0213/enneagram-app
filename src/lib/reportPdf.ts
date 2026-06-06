import html2pdf from 'html2pdf.js';

/** 将图片转为 data URL，避免导出 PDF 时资源路径失效 */
export async function inlineImages(root: ParentNode): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      const raw = img.getAttribute('src');
      if (!raw || raw.startsWith('data:')) return;
      try {
        const absolute = new URL(raw, window.location.href).href;
        const res = await fetch(absolute);
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        img.setAttribute('src', dataUrl);
      } catch {
        img.setAttribute('src', new URL(raw, window.location.href).href);
      }
    })
  );
}

function waitForImages(root: ParentNode): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
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

/** 从已渲染的 .report-document 节点导出 A4 PDF Blob */
export async function exportReportPdfBlob(reportRoot: HTMLElement): Promise<Blob> {
  const clone = reportRoot.cloneNode(true) as HTMLElement;
  await inlineImages(clone);
  await waitForImages(clone);

  const wrapper = document.createElement('div');
  wrapper.style.width = '210mm';
  wrapper.style.background = '#fff';
  wrapper.appendChild(clone);

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const blob = await html2pdf()
    .set({
      margin: 0,
      filename: 'INSIGHT_BOOK.pdf',
      image: { type: 'jpeg', quality: 0.96 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    } as Record<string, unknown>)
    .from(wrapper)
    .outputPdf('blob');

  return blob as Blob;
}
