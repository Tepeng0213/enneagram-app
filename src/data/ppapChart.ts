/** PPAP 折线图 X 轴顺序（与样例 PDF 第 3 页一致） */
export const PPAP_LINE_CHART_ORDER: number[] = [8, 9, 1, 2, 3, 4, 5, 6, 7];

export const PPAP_CHART_Y_MAX = 45;
export const PPAP_CHART_Y_TICKS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];

/** 雷达图：轴顺序与折线图一致，从顶部 8 号顺时针 */
export const PPAP_RADAR_ORDER = PPAP_LINE_CHART_ORDER;

/** 雷达刻度与样例 PDF 一致 */
export const PPAP_RADAR_SCALE_MIN = 15;
export const PPAP_RADAR_SCALE_MAX = 50;
export const PPAP_RADAR_RING_TICKS = [15, 20, 25, 30, 35, 40, 45, 50];

/** 参考线：绿色偏高区、红色偏低区（固定值，非受测者数据） */
export const PPAP_RADAR_REF_HIGH = 35;
export const PPAP_RADAR_REF_LOW = 24;
