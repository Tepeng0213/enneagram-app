/** 意识地图单行：霍金斯 LUX 层级标准数据 */
export interface ConsciousnessMapRow {
  lux: string;
  level: string;
  emotion: string;
  action: string;
  happiness: string;
  zone: 'power' | 'force';
}

/** 17 层级意识地图 + 标准幸福率（静态基准库） */
export const consciousnessMapData: ConsciousnessMapRow[] = [
  { lux: '700~1000', level: '开悟', emotion: '纯粹意识', action: '纯粹面貌', happiness: '100%', zone: 'power' },
  { lux: '600', level: '和平', emotion: '合一', action: '人类贡献', happiness: '99%', zone: 'power' },
  { lux: '540', level: '喜悦', emotion: '感激', action: '祝愿', happiness: '96%', zone: 'power' },
  { lux: '500', level: '爱', emotion: '尊崇', action: '共存', happiness: '89%', zone: 'power' },
  { lux: '400', level: '理性', emotion: '理解', action: '洞察力', happiness: '79%', zone: 'power' },
  { lux: '350', level: '包容', emotion: '宽恕', action: '容忍', happiness: '71%', zone: 'power' },
  { lux: '310', level: '自发', emotion: '乐观', action: '亲切', happiness: '68%', zone: 'power' },
  { lux: '250', level: '中立', emotion: '信赖', action: '柔韧', happiness: '60%', zone: 'power' },
  { lux: '200', level: '勇气', emotion: '肯定', action: '赋予力量', happiness: '55%', zone: 'power' },
  { lux: '175', level: '骄傲', emotion: '轻蔑', action: '夸张', happiness: '22%', zone: 'force' },
  { lux: '150', level: '愤怒', emotion: '憎恨', action: '攻击', happiness: '12%', zone: 'force' },
  { lux: '125', level: '欲望', emotion: '渴望', action: '执着', happiness: '10%', zone: 'force' },
  { lux: '100', level: '恐惧', emotion: '忧虑', action: '逃避', happiness: '10%', zone: 'force' },
  { lux: '75', level: '悲伤', emotion: '懊悔', action: '沮丧', happiness: '9%', zone: 'force' },
  { lux: '50', level: '无力', emotion: '绝望', action: '放弃', happiness: '5%', zone: 'force' },
  { lux: '30', level: '内疚', emotion: '谴责', action: '惩罚', happiness: '4%', zone: 'force' },
  { lux: '20', level: '羞耻', emotion: '屈辱', action: '残忍', happiness: '1%', zone: 'force' },
];

export const POWER_ZONE_ROWS = consciousnessMapData.filter((r) => r.zone === 'power').length;
export const FORCE_ZONE_ROWS = consciousnessMapData.filter((r) => r.zone === 'force').length;

export const CONSCIOUSNESS_MAP_POWER_DESC =
  '积极意识区间：和谐、愿景、创造力与内在力量。处于 Power 区的人较少依赖外在对抗，更能以整合的方式回应生活。';

export const CONSCIOUSNESS_MAP_FORCE_DESC =
  '消极防御区间：缺乏和谐、冲突与消耗。处于 Force 区的人常以外在压力与防御机制维持自我，幸福率显著下降。';

export const CONSCIOUSNESS_MAP_FOOTNOTE_POWER =
  'Power（力量）：以整合、创造与和谐为特征的意识状态，对应较高的主观幸福体验。';

export const CONSCIOUSNESS_MAP_FOOTNOTE_FORCE =
  'Force（强迫）：以冲突、防御与消耗为特征的意识状态，对应较低的主观幸福体验。';
