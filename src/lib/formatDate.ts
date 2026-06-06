/** 报告展示：检测日期仅年月日 YYYY-MM-DD */
export function formatReportDate(value: string): string {
  if (!value?.trim()) return '—';

  const m = value.trim().match(/^(\d{4})[-./\s年](\d{1,2})[-./\s月](\d{1,2})/);
  if (m) {
    return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
  }

  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${mo}-${day}`;
  }

  return value.slice(0, 10);
}
