/** 九型中文名称（报告全文统一，格式：X号 + XX型） */
export const TYPE_NAMES: Record<number, string> = {
  1: '改革型',
  2: '助人型',
  3: '进取型',
  4: '个人主义型',
  5: '探索型',
  6: '效忠型',
  7: '活跃型',
  8: '挑战型',
  9: '调解型',
};

/** 仅类型名，如「活跃型」 */
export function typeLabel(type: number): string {
  return TYPE_NAMES[type] ?? `${type}号型`;
}

/** 带编号，如「7号 活跃型」（页头主型等） */
export function typeLabelWithNumber(type: number): string {
  return `${type}号 ${typeLabel(type)}`;
}

/** 数据条内短名，与 typeLabel 一致 */
export function typeBarLabel(type: number): string {
  return typeLabel(type);
}
