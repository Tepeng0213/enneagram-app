import type { Answers, CenterKey, ScoreResult } from './scoring';

const WEBAPP_URL = import.meta.env.VITE_SHEET_WEBAPP_URL as string | undefined;
const API_SECRET = import.meta.env.VITE_SHEET_API_SECRET as string | undefined;

/** 本地开发走 Vite 代理，避免浏览器 CORS 拦截 Google Apps Script */
function getWebAppUrl(): string | undefined {
  const url = WEBAPP_URL?.trim();
  if (!url) return undefined;
  if (import.meta.env.DEV && url.includes('script.google.com')) {
    return '/gas-proxy';
  }
  return url;
}

export function isSheetApiConfigured(): boolean {
  return Boolean(getWebAppUrl() && API_SECRET?.trim());
}

/** 全部 91 题选项（1～5），用于答卷明细归档 */
export type QuestionAnswers = Answers;

export interface SheetSavePayload {
  name: string;
  result: ScoreResult;
  /** 题号 1～91 → 1～5 */
  answers: QuestionAnswers;
}

export interface SheetSaveResponse {
  ok: boolean;
  row?: number;
  message?: string;
  error?: string;
  archive?: {
    ok?: boolean;
    folderName?: string;
    folderUrl?: string;
    fileUrl?: string;
    fileName?: string;
    error?: string;
  };
}

export interface UploadReportPdfResponse {
  ok: boolean;
  fileUrl?: string;
  fileName?: string;
  folderName?: string;
  folderUrl?: string;
  error?: string;
}

export interface SummaryRowPayload {
  timestamp: string;
  name: string;
  source?: string;
  scores: Record<string | number, number>;
  coreType: number;
  coreScore: number;
  centers: ScoreResult['centers'];
  stressAnswers?: Record<number, number>;
}

export interface FetchRowResponse {
  ok: boolean;
  row?: number;
  data?: SummaryRowPayload;
  error?: string;
}

/** 从「汇总」表读取指定行（表头为第 1 行，样例预览默认第 2 行） */
export interface RecentReportItem {
  row: number;
  timestamp: string;
  name: string;
  coreType: number;
  coreScore: number;
  /** 汇总表固定测试行（如第 2 行），不受「近 3 天」限制 */
  isTestSample?: boolean;
}

/** 开发测试用汇总表行号，默认第 2 行 */
export function getReportTestRow(): number {
  const n = Number(import.meta.env.VITE_REPORT_TEST_ROW);
  return n >= 2 ? n : 2;
}

export interface ListRecentResponse {
  ok: boolean;
  items?: RecentReportItem[];
  days?: number;
  error?: string;
}

export interface ArchiveResponse {
  ok: boolean;
  archived?: number;
  skipped?: number;
  errors?: string[];
  folderName?: string;
  folderUrl?: string;
  error?: string;
}

async function postSheetAction<T>(payload: Record<string, unknown>): Promise<T> {
  const body = JSON.stringify({ secret: API_SECRET, ...payload });
  const res = await fetch(getWebAppUrl()!, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  });
  const text = await res.text();
  return JSON.parse(text) as T;
}

/** 近 N 天内的报告（可在线查看）；testRow 始终列入（用于汇总表测试行） */
export async function fetchRecentReports(
  days = 3,
  testRow = getReportTestRow()
): Promise<ListRecentResponse> {
  if (!isSheetApiConfigured()) {
    return { ok: false, error: '未配置 VITE_SHEET_WEBAPP_URL 或 VITE_SHEET_API_SECRET' };
  }
  try {
    const data = await postSheetAction<ListRecentResponse>({
      action: 'listRecent',
      days,
      testRow,
    });
    return data.ok ? data : { ok: false, error: data.error || '加载失败' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg + '。请重新部署 WebAppSubmit' };
  }
}

/** 将早于 N 天的记录导出 PDF 到 Google 云端硬盘归档文件夹 */
export async function archiveOldReports(days = 3, auto = false): Promise<ArchiveResponse> {
  if (!isSheetApiConfigured()) {
    return { ok: false, error: '未配置表格接口' };
  }
  try {
    const data = await postSheetAction<ArchiveResponse>({ action: 'archiveOld', days, auto });
    return data.ok ? data : { ok: false, error: data.error || '归档失败' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

export async function fetchSummaryRow(row: number): Promise<FetchRowResponse> {
  if (!isSheetApiConfigured()) {
    return { ok: false, error: '未配置 VITE_SHEET_WEBAPP_URL 或 VITE_SHEET_API_SECRET' };
  }

  const body = JSON.stringify({
    secret: API_SECRET,
    action: 'getRow',
    row,
  });

  try {
    const res = await fetch(getWebAppUrl()!, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
    });
    const text = await res.text();
    const data = JSON.parse(text) as FetchRowResponse;
    return data.ok ? data : { ok: false, error: data.error || '读取失败' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg + '。请确认已重新部署 WebAppSubmit 并重启 npm run dev' };
  }
}

export async function saveResultToSheet(
  payload: SheetSavePayload
): Promise<SheetSaveResponse> {
  if (!isSheetApiConfigured()) {
    return { ok: false, error: '未配置 VITE_SHEET_WEBAPP_URL 或 VITE_SHEET_API_SECRET' };
  }

  const { name, result, answers } = payload;
  const body = {
    secret: API_SECRET,
    name: name.trim(),
    scores: result.scores,
    coreType: result.coreType,
    coreScore: result.coreScore,
    centers: {
      body: result.centers.body,
      heart: result.centers.heart,
      head: result.centers.head,
    },
    answers,
  };

  const json = JSON.stringify(body);

  // 使用 text/plain 避免触发 CORS 预检（application/json 易导致 Failed to fetch）
  let res: Response;
  try {
    res = await fetch(getWebAppUrl()!, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: json,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error:
        msg +
        '。请确认：① Apps Script 已部署为网页应用且「任何人」可访问；② 已重新运行 npm run dev；③ 见 SHEET_WEB_SETUP.md 配置代理',
    };
  }

  const text = await res.text();
  let data: SheetSaveResponse;
  try {
    data = JSON.parse(text) as SheetSaveResponse;
  } catch {
    return {
      ok: false,
      error:
        '服务器返回非 JSON（' +
        res.status +
        '）：' +
        text.slice(0, 120) +
        '。若含「登录」字样，请将部署权限改为「任何人」并重新部署',
    };
  }

  if (!data.ok) {
    return { ok: false, error: data.error || '保存失败' };
  }

  return data;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result;
      if (typeof raw !== 'string') {
        reject(new Error('读取 PDF 失败'));
        return;
      }
      const comma = raw.indexOf(',');
      resolve(comma >= 0 ? raw.slice(comma + 1) : raw);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** 上传完整报告 PDF 到 Google 云端硬盘 profigram 文件夹 */
export async function uploadReportPdf(
  row: number,
  pdfBlob: Blob,
  name: string,
  testedAt: string
): Promise<UploadReportPdfResponse> {
  if (!isSheetApiConfigured()) {
    return { ok: false, error: '未配置表格接口' };
  }

  try {
    const pdfBase64 = await blobToBase64(pdfBlob);
    const data = await postSheetAction<UploadReportPdfResponse>({
      action: 'uploadReportPdf',
      row,
      name: name.trim(),
      testedAt,
      pdfBase64,
    });
    return data.ok ? data : { ok: false, error: data.error || '上传 PDF 失败' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}
