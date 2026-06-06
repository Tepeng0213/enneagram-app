/** 报告第 2 页：九型总览固定文案（与样例 PDF 对齐） */

export type CenterGroup = 'body' | 'heart' | 'head';

export interface TypeOverviewContent {
  type: number;
  center: CenterGroup;
  title: string;
  subtitle: string;
  intro: string;
  lowKeywords: string[];
  highKeywords: string[];
}

/** 样例页展示顺序：体中心 → 心中心 → 脑中心 */
export const OVERVIEW_DISPLAY_ORDER: number[] = [8, 9, 1, 2, 3, 4, 5, 6, 7];

export const TYPE_OVERVIEW: Record<number, TypeOverviewContent> = {
  1: {
    type: 1,
    center: 'body',
    title: '1号 改革型',
    subtitle: '改善的自我',
    intro: '重视原则，追求完美的改善者',
    lowKeywords: ['极度挑剔', '严厉教条', '强迫压抑', '道德批判', '苛刻难取悦'],
    highKeywords: ['睿智客观', '宽容理性', '道德勇气', '正直自律', '杰出榜样'],
  },
  2: {
    type: 2,
    center: 'heart',
    title: '2号 助人型',
    subtitle: '照顾的自我',
    intro: '深切共情他人的情感与需求，并提供帮助的照顾者',
    lowKeywords: ['操控强求', '骄傲受害', '过度干涉', '索求回报', '躯体化诉苦'],
    highKeywords: ['无私体贴', '慷慨共情', '健康边界', '滋养他人', '快乐谦逊'],
  },
  3: {
    type: 3,
    center: 'heart',
    title: '3号 进取型',
    subtitle: '成就的自我',
    intro: '追求成功与认可，在实现目标上极其高效的成就者',
    lowKeywords: ['虚荣自欺', '好胜缺原则', '情感空虚', '利用他人', '匮乏嫉妒'],
    highKeywords: ['自信真实', '有魅力', '精力充沛', '鼓舞团队', '杰出模范'],
  },
  4: {
    type: 4,
    center: 'heart',
    title: '4号 个人主义型',
    subtitle: '表现的自我',
    intro: '深入探索自身的独特性，并以艺术化方式表达自我的个性派',
    lowKeywords: ['自我放纵', '忧郁嫉妒', '疏离绝望', '自我憎恨', '沉溺幻想'],
    highKeywords: ['创造力', '高度自省', '情感真挚', '艺术灵感', '真实独特'],
  },
  5: {
    type: 5,
    center: 'head',
    title: '5号 探索型',
    subtitle: '探究的自我',
    intro: '追求知识，以分析性和独立思考为特征的探究者',
    lowKeywords: ['极度孤僻', '愤世嫉俗', '脱离现实', '思维迷宫', '恐惧虚无'],
    highKeywords: ['远见先驱', '客观专注', '深刻洞察', '创新发现', '积极参与'],
  },
  6: {
    type: 6,
    center: 'head',
    title: '6号 效忠型',
    subtitle: '信赖的自我',
    intro: '重视稳定与安全，具有强烈忠诚心的信赖守护者',
    lowKeywords: ['焦虑多疑', '偏执反应', '盲目顺从', '极端反叛', '恐慌投射'],
    highKeywords: ['可靠勇敢', '内在信心', '团队建设', '责任感', '为弱者挺身而出'],
  },
  7: {
    type: 7,
    center: 'head',
    title: '7号 活跃型',
    subtitle: '享受的自我',
    intro: '乐观、活动力强，不断追求各种新鲜体验的冒险家',
    lowKeywords: ['冲动贪婪', '缺乏耐心', '过度放纵', '精力分散', '半途而废'],
    highKeywords: ['感染力', '富有远见', '懂得感恩', '高度专注', '快乐源泉'],
  },
  8: {
    type: 8,
    center: 'body',
    title: '8号 挑战型',
    subtitle: '挑战的自我',
    intro: '强大、果断，保护自己及周围人的天生领导者',
    lowKeywords: ['专横破坏', '控制无情', '好斗恐吓', '报复独裁', '掩盖脆弱'],
    highKeywords: ['宽宏大量', '英雄气概', '果断同情', '保护弱者', '赋权领袖'],
  },
  9: {
    type: 9,
    center: 'body',
    title: '9号 调解型',
    subtitle: '和解的自我',
    intro: '重视和平与和谐，竭力避免冲突的居中调解者',
    lowKeywords: ['被动固执', '麻木疏离', '压抑愤怒', '消极抵抗', '琐事麻醉'],
    highKeywords: ['包容稳重', '平和自主', '综合观点', '和平缔造', '团结疗愈'],
  },
};

export const CENTER_COLORS: Record<
  CenterGroup,
  { bar: string; barDark: string; label: string }
> = {
  body: { bar: '#c45c5c', barDark: '#9e3d3d', label: '体中心' },
  heart: { bar: '#5a9e5a', barDark: '#3d7a3d', label: '心中心' },
  head: { bar: '#5a7ab5', barDark: '#3d5a87', label: '头脑中心' },
};

export const CHART_SCALE_MAX = 40;
export const CHART_TICKS = [5, 10, 15, 20, 25, 30, 35, 40];
