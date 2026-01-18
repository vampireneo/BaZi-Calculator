/**
 * 八字神煞計算模組
 * 根據四柱干支計算傳統八字神煞
 */

import type { Pillar } from './baziHelper';

// 神煞類型定義
export interface BaZiShenSha {
  name: string;
  type: '吉' | '凶' | '中';
  description: string;
  positions: string[]; // 出現在哪些柱位
}

/**
 * 天乙貴人查詢表
 * 以日干查詢，看其他柱的地支是否符合
 */
const TIANYI_GUIREN: Record<string, string[]> = {
  甲: ['丑', '未'],
  戊: ['丑', '未'],
  庚: ['丑', '未'],
  乙: ['子', '申'],
  己: ['子', '申'],
  丙: ['亥', '酉'],
  丁: ['亥', '酉'],
  辛: ['午', '寅'],
  壬: ['卯', '巳'],
  癸: ['卯', '巳'],
};

/**
 * 文昌貴人查詢表
 * 以日干查詢
 */
const WENCHANG: Record<string, string> = {
  甲: '巳',
  乙: '午',
  丙: '申',
  丁: '酉',
  戊: '申',
  己: '酉',
  庚: '亥',
  辛: '子',
  壬: '寅',
  癸: '卯',
};

/**
 * 桃花（咸池）查詢表
 * 以日支或年支的三合局查詢
 */
const TAOHUA: Record<string, string> = {
  申: '酉',
  子: '酉',
  辰: '酉', // 申子辰見酉
  寅: '卯',
  午: '卯',
  戌: '卯', // 寅午戌見卯
  巳: '午',
  酉: '午',
  丑: '午', // 巳酉丑見午
  亥: '子',
  卯: '子',
  未: '子', // 亥卯未見子
};

/**
 * 驛馬查詢表
 * 以日支或年支的三合局查詢
 */
const YIMA: Record<string, string> = {
  申: '寅',
  子: '寅',
  辰: '寅', // 申子辰見寅
  寅: '申',
  午: '申',
  戌: '申', // 寅午戌見申
  巳: '亥',
  酉: '亥',
  丑: '亥', // 巳酉丑見亥
  亥: '巳',
  卯: '巳',
  未: '巳', // 亥卯未見巳
};

/**
 * 華蓋查詢表
 * 以日支或年支的三合局查詢
 */
const HUAGAI: Record<string, string> = {
  申: '辰',
  子: '辰',
  辰: '辰', // 申子辰見辰
  寅: '戌',
  午: '戌',
  戌: '戌', // 寅午戌見戌
  巳: '丑',
  酉: '丑',
  丑: '丑', // 巳酉丑見丑
  亥: '未',
  卯: '未',
  未: '未', // 亥卯未見未
};

/**
 * 將星查詢表
 * 以日支或年支的三合局查詢
 */
const JIANGXING: Record<string, string> = {
  申: '子',
  子: '子',
  辰: '子', // 申子辰見子
  寅: '午',
  午: '午',
  戌: '午', // 寅午戌見午
  巳: '酉',
  酉: '酉',
  丑: '酉', // 巳酉丑見酉
  亥: '卯',
  卯: '卯',
  未: '卯', // 亥卯未見卯
};

/**
 * 祿神查詢表
 * 以日干查詢
 */
const LUSHEN: Record<string, string> = {
  甲: '寅',
  乙: '卯',
  丙: '巳',
  丁: '午',
  戊: '巳',
  己: '午',
  庚: '申',
  辛: '酉',
  壬: '亥',
  癸: '子',
};

/**
 * 羊刃查詢表
 * 以日干查詢（陽干才有羊刃）
 */
const YANGREN: Record<string, string> = {
  甲: '卯',
  丙: '午',
  戊: '午',
  庚: '酉',
  壬: '子',
};

/**
 * 天德貴人查詢表
 * 以月支查詢
 */
const TIANDE: Record<string, string> = {
  寅: '丁',
  卯: '申',
  辰: '壬',
  巳: '辛',
  午: '亥',
  未: '甲',
  申: '癸',
  酉: '寅',
  戌: '丙',
  亥: '乙',
  子: '巳',
  丑: '庚',
};

/**
 * 月德貴人查詢表
 * 以月支查詢
 */
const YUEDE: Record<string, string> = {
  寅: '丙',
  午: '丙',
  戌: '丙', // 寅午戌月見丙
  申: '壬',
  子: '壬',
  辰: '壬', // 申子辰月見壬
  亥: '甲',
  卯: '甲',
  未: '甲', // 亥卯未月見甲
  巳: '庚',
  酉: '庚',
  丑: '庚', // 巳酉丑月見庚
};

/**
 * 金輿查詢表
 * 以日干查詢
 */
const JINYU: Record<string, string> = {
  甲: '辰',
  乙: '巳',
  丙: '未',
  丁: '申',
  戊: '未',
  己: '申',
  庚: '戌',
  辛: '亥',
  壬: '丑',
  癸: '寅',
};

/**
 * 劫煞查詢表
 * 以日支或年支查詢
 */
const JIESHA: Record<string, string> = {
  申: '巳',
  子: '巳',
  辰: '巳', // 申子辰見巳
  寅: '亥',
  午: '亥',
  戌: '亥', // 寅午戌見亥
  巳: '寅',
  酉: '寅',
  丑: '寅', // 巳酉丑見寅
  亥: '申',
  卯: '申',
  未: '申', // 亥卯未見申
};

/**
 * 亡神查詢表
 * 以日支或年支查詢
 */
const WANGSHEN: Record<string, string> = {
  申: '亥',
  子: '亥',
  辰: '亥', // 申子辰見亥
  寅: '巳',
  午: '巳',
  戌: '巳', // 寅午戌見巳
  巳: '申',
  酉: '申',
  丑: '申', // 巳酉丑見申
  亥: '寅',
  卯: '寅',
  未: '寅', // 亥卯未見寅
};

/**
 * 孤辰查詢表
 * 以年支查詢
 */
const GUCHEN: Record<string, string> = {
  亥: '寅',
  子: '寅',
  丑: '寅',
  寅: '巳',
  卯: '巳',
  辰: '巳',
  巳: '申',
  午: '申',
  未: '申',
  申: '亥',
  酉: '亥',
  戌: '亥',
};

/**
 * 寡宿查詢表
 * 以年支查詢
 */
const GUASU: Record<string, string> = {
  亥: '戌',
  子: '戌',
  丑: '戌',
  寅: '丑',
  卯: '丑',
  辰: '丑',
  巳: '辰',
  午: '辰',
  未: '辰',
  申: '未',
  酉: '未',
  戌: '未',
};

/**
 * 天廚貴人查詢表
 * 以日干查詢
 */
const TIANCHU: Record<string, string> = {
  甲: '巳',
  乙: '午',
  丙: '巳',
  丁: '申',
  戊: '申',
  己: '卯',
  庚: '亥',
  辛: '酉',
  壬: '寅',
  癸: '子',
};

/**
 * 福星貴人查詢表
 * 以日干查詢
 */
const FUXING: Record<string, string> = {
  甲: '寅',
  乙: '丑',
  丙: '亥',
  丁: '戌',
  戊: '申',
  己: '未',
  庚: '巳',
  辛: '辰',
  壬: '寅',
  癸: '丑',
};

/**
 * 國印貴人查詢表
 * 以日干查詢
 */
const GUOYIN: Record<string, string> = {
  甲: '戌',
  乙: '亥',
  丙: '丑',
  丁: '寅',
  戊: '丑',
  己: '寅',
  庚: '辰',
  辛: '巳',
  壬: '未',
  癸: '申',
};

/**
 * 學堂查詢表
 * 以日干查詢
 */
const XUETANG: Record<string, string> = {
  甲: '亥',
  乙: '午',
  丙: '寅',
  丁: '酉',
  戊: '寅',
  己: '酉',
  庚: '巳',
  辛: '子',
  壬: '申',
  癸: '卯',
};

/**
 * 詞館查詢表
 * 以日干查詢
 */
const CIGUAN: Record<string, string> = {
  甲: '寅',
  乙: '丑',
  丙: '申',
  丁: '巳',
  戊: '申',
  己: '巳',
  庚: '亥',
  辛: '戌',
  壬: '寅',
  癸: '亥',
};

/**
 * 魁罡查詢表
 * 以日柱干支組合查詢
 */
const KUIGANG: string[] = ['庚辰', '庚戌', '壬辰', '戊戌'];

/**
 * 天羅地網查詢表
 * 辰為天羅、戌為地網
 */
const TIANLUODIWANG = {
  天羅: '辰',
  地網: '戌',
};

/**
 * 災煞查詢表
 * 以日支或年支查詢
 */
const ZAISHA: Record<string, string> = {
  申: '午',
  子: '午',
  辰: '午', // 申子辰見午
  寅: '子',
  午: '子',
  戌: '子', // 寅午戌見子
  巳: '卯',
  酉: '卯',
  丑: '卯', // 巳酉丑見卯
  亥: '酉',
  卯: '酉',
  未: '酉', // 亥卯未見酉
};

/**
 * 天煞查詢表（又稱天殺）
 * 以日支或年支查詢
 */
const TIANSHA: Record<string, string> = {
  申: '戌',
  子: '戌',
  辰: '戌', // 申子辰見戌
  寅: '辰',
  午: '辰',
  戌: '辰', // 寅午戌見辰
  巳: '丑',
  酉: '丑',
  丑: '丑', // 巳酉丑見丑
  亥: '未',
  卯: '未',
  未: '未', // 亥卯未見未
};

/**
 * 地煞查詢表
 * 以日支或年支查詢
 */
const DISHA: Record<string, string> = {
  申: '辰',
  子: '辰',
  辰: '辰', // 申子辰見辰
  寅: '戌',
  午: '戌',
  戌: '戌', // 寅午戌見戌
  巳: '未',
  酉: '未',
  丑: '未', // 巳酉丑見未
  亥: '丑',
  卯: '丑',
  未: '丑', // 亥卯未見丑
};

/**
 * 紅艷煞查詢表
 * 以日干查詢
 */
const HONGYAN: Record<string, string> = {
  甲: '午',
  乙: '申',
  丙: '寅',
  丁: '未',
  戊: '辰',
  己: '辰',
  庚: '戌',
  辛: '酉',
  壬: '子',
  癸: '申',
};

/**
 * 流霞煞查詢表
 * 以日干查詢
 */
const LIUXIA: Record<string, string> = {
  甲: '酉',
  乙: '戌',
  丙: '未',
  丁: '申',
  戊: '未',
  己: '申',
  庚: '巳',
  辛: '午',
  壬: '卯',
  癸: '辰',
};

/**
 * 血刃查詢表
 * 以日干查詢
 */
const XUEREN: Record<string, string> = {
  甲: '卯',
  乙: '辰',
  丙: '午',
  丁: '未',
  戊: '午',
  己: '未',
  庚: '酉',
  辛: '戌',
  壬: '子',
  癸: '丑',
};

/**
 * 天醫查詢表
 * 以月支查詢
 */
const TIANYI_DOCTOR: Record<string, string> = {
  子: '亥',
  丑: '子',
  寅: '丑',
  卯: '寅',
  辰: '卯',
  巳: '辰',
  午: '巳',
  未: '午',
  申: '未',
  酉: '申',
  戌: '酉',
  亥: '戌',
};

/**
 * 太極貴人查詢表
 * 以日干查詢
 */
const TAIJI: Record<string, string[]> = {
  甲: ['子', '午'],
  乙: ['子', '午'],
  丙: ['卯', '酉'],
  丁: ['卯', '酉'],
  戊: ['辰', '戌', '丑', '未'],
  己: ['辰', '戌', '丑', '未'],
  庚: ['寅', '亥'],
  辛: ['寅', '亥'],
  壬: ['巳', '申'],
  癸: ['巳', '申'],
};

/**
 * 三奇貴人（天上三奇：甲戊庚、地上三奇：乙丙丁、人中三奇：壬癸辛）
 */
const SANQI = {
  天上三奇: ['甲', '戊', '庚'],
  地上三奇: ['乙', '丙', '丁'],
  人中三奇: ['壬', '癸', '辛'],
};

/**
 * 天喜查詢表
 * 以年支查詢
 */
const TIANXI: Record<string, string> = {
  子: '酉',
  丑: '申',
  寅: '未',
  卯: '午',
  辰: '巳',
  巳: '辰',
  午: '卯',
  未: '寅',
  申: '丑',
  酉: '子',
  戌: '亥',
  亥: '戌',
};

/**
 * 紅鸞查詢表
 * 以年支查詢
 */
const HONGLUAN: Record<string, string> = {
  子: '卯',
  丑: '寅',
  寅: '丑',
  卯: '子',
  辰: '亥',
  巳: '戌',
  午: '酉',
  未: '申',
  申: '未',
  酉: '午',
  戌: '巳',
  亥: '辰',
};

/**
 * 天赦日查詢
 * 特定日柱組合
 */
const TIANSHE: Array<{ season: string[]; dayStem: string; dayBranch: string }> =
  [
    { season: ['寅', '卯'], dayStem: '戊', dayBranch: '寅' }, // 春季戊寅日
    { season: ['巳', '午'], dayStem: '甲', dayBranch: '午' }, // 夏季甲午日
    { season: ['申', '酉'], dayStem: '戊', dayBranch: '申' }, // 秋季戊申日
    { season: ['亥', '子'], dayStem: '甲', dayBranch: '子' }, // 冬季甲子日
    { season: ['辰', '戌', '丑', '未'], dayStem: '戊', dayBranch: '辰' }, // 四季月戊辰日
  ];

/**
 * 陰陽差錯查詢表
 * 特定日柱組合
 */
const YINYANG_CHACUO: string[] = [
  '丙子',
  '丁丑',
  '戊寅',
  '辛卯',
  '壬辰',
  '癸巳',
  '丙午',
  '丁未',
  '戊申',
  '辛酉',
  '壬戌',
  '癸亥',
];

/**
 * 陰陽煞查詢表（又稱十惡大敗）
 * 特定日柱組合
 */
const SHIE_DABAI: string[] = [
  '甲辰',
  '乙巳',
  '丙申',
  '丁亥',
  '戊戌',
  '己丑',
  '庚辰',
  '辛巳',
  '壬申',
  '癸亥',
];

/**
 * 月德合查詢表
 * 以月支查詢，為月德貴人的六合版本
 */
const YUEDE_HE: Record<string, string> = {
  寅: '辛',
  午: '辛',
  戌: '辛', // 寅午戌月見辛（丙合辛）
  申: '丁',
  子: '丁',
  辰: '丁', // 申子辰月見丁（壬合丁）
  亥: '己',
  卯: '己',
  未: '己', // 亥卯未月見己（甲合己）
  巳: '乙',
  酉: '乙',
  丑: '乙', // 巳酉丑月見乙（庚合乙）
};

/**
 * 天德合查詢表
 * 以月支查詢，為天德貴人的六合版本（只有天干才有合）
 */
const TIANDE_HE: Record<string, string> = {
  寅: '壬', // 天德丁，合壬
  辰: '丁', // 天德壬，合丁
  巳: '丙', // 天德辛，合丙
  未: '己', // 天德甲，合己
  申: '戊', // 天德癸，合戊
  戌: '辛', // 天德丙，合辛
  亥: '庚', // 天德乙，合庚
  丑: '乙', // 天德庚，合乙
};

/**
 * 六秀日查詢表
 * 特定日柱組合，主聰明秀氣
 */
const LIUXIU: string[] = ['丙午', '丁未', '戊子', '己丑', '癸巳', '癸酉'];

/**
 * 八專日查詢表
 * 特定日柱組合，主專一之氣
 */
const BAZHUAN: string[] = [
  '甲寅',
  '乙卯',
  '戊辰',
  '己未',
  '庚申',
  '辛酉',
  '壬子',
  '癸亥',
];

/**
 * 弔客查詢表
 * 以年支查詢
 */
const DIAOKE: Record<string, string> = {
  子: '戌',
  丑: '亥',
  寅: '子',
  卯: '丑',
  辰: '寅',
  巳: '卯',
  午: '辰',
  未: '巳',
  申: '午',
  酉: '未',
  戌: '申',
  亥: '酉',
};

/**
 * 天狗查詢表
 * 以年支查詢
 */
const TIANGOU: Record<string, string> = {
  子: '戌',
  丑: '亥',
  寅: '子',
  卯: '丑',
  辰: '寅',
  巳: '卯',
  午: '辰',
  未: '巳',
  申: '午',
  酉: '未',
  戌: '申',
  亥: '酉',
};

/**
 * 截空（空亡）查詢表
 * 以日柱所在旬查詢空亡地支
 */
const KONGWANG: Record<string, string[]> = {
  甲子: ['戌', '亥'],
  甲戌: ['申', '酉'],
  甲申: ['午', '未'],
  甲午: ['辰', '巳'],
  甲辰: ['寅', '卯'],
  甲寅: ['子', '丑'],
};

/**
 * 六十甲子對應的旬首
 */
const JIAZI_TO_XUN: Record<string, string> = {
  甲子: '甲子',
  乙丑: '甲子',
  丙寅: '甲子',
  丁卯: '甲子',
  戊辰: '甲子',
  己巳: '甲子',
  庚午: '甲子',
  辛未: '甲子',
  壬申: '甲子',
  癸酉: '甲子',
  甲戌: '甲戌',
  乙亥: '甲戌',
  丙子: '甲戌',
  丁丑: '甲戌',
  戊寅: '甲戌',
  己卯: '甲戌',
  庚辰: '甲戌',
  辛巳: '甲戌',
  壬午: '甲戌',
  癸未: '甲戌',
  甲申: '甲申',
  乙酉: '甲申',
  丙戌: '甲申',
  丁亥: '甲申',
  戊子: '甲申',
  己丑: '甲申',
  庚寅: '甲申',
  辛卯: '甲申',
  壬辰: '甲申',
  癸巳: '甲申',
  甲午: '甲午',
  乙未: '甲午',
  丙申: '甲午',
  丁酉: '甲午',
  戊戌: '甲午',
  己亥: '甲午',
  庚子: '甲午',
  辛丑: '甲午',
  壬寅: '甲午',
  癸卯: '甲午',
  甲辰: '甲辰',
  乙巳: '甲辰',
  丙午: '甲辰',
  丁未: '甲辰',
  戊申: '甲辰',
  己酉: '甲辰',
  庚戌: '甲辰',
  辛亥: '甲辰',
  壬子: '甲辰',
  癸丑: '甲辰',
  甲寅: '甲寅',
  乙卯: '甲寅',
  丙辰: '甲寅',
  丁巳: '甲寅',
  戊午: '甲寅',
  己未: '甲寅',
  庚申: '甲寅',
  辛酉: '甲寅',
  壬戌: '甲寅',
  癸亥: '甲寅',
};

/**
 * 元辰查詢表
 * 以年支查詢，男女命不同
 * 男命陽年順行，陰年逆行；女命相反
 */
const YUANCHEN_YANG: Record<string, string> = {
  // 陽年男命/陰年女命
  子: '未',
  寅: '酉',
  辰: '亥',
  午: '丑',
  申: '卯',
  戌: '巳',
};
const YUANCHEN_YIN: Record<string, string> = {
  // 陰年男命/陽年女命
  丑: '午',
  卯: '申',
  巳: '戌',
  未: '子',
  酉: '寅',
  亥: '辰',
};

/**
 * 沐浴查詢表
 * 以日干查詢十二長生的沐浴位
 */
const MUYU: Record<string, string> = {
  甲: '子',
  乙: '巳',
  丙: '卯',
  丁: '申',
  戊: '卯',
  己: '申',
  庚: '午',
  辛: '亥',
  壬: '酉',
  癸: '寅',
};

/**
 * 月破查詢表
 * 月支的對沖地支
 */
const YUEPO: Record<string, string> = {
  子: '午',
  丑: '未',
  寅: '申',
  卯: '酉',
  辰: '戌',
  巳: '亥',
  午: '子',
  未: '丑',
  申: '寅',
  酉: '卯',
  戌: '辰',
  亥: '巳',
};

/**
 * 隔角查詢表
 * 以年支查詢，地支相隔兩位
 */
const GEJIAO: Record<string, string[]> = {
  子: ['寅', '戌'],
  丑: ['卯', '亥'],
  寅: ['辰', '子'],
  卯: ['巳', '丑'],
  辰: ['午', '寅'],
  巳: ['未', '卯'],
  午: ['申', '辰'],
  未: ['酉', '巳'],
  申: ['戌', '午'],
  酉: ['亥', '未'],
  戌: ['子', '申'],
  亥: ['丑', '酉'],
};

/**
 * 玉堂貴人查詢表
 * 以日干查詢
 */
const YUTANG: Record<string, string> = {
  甲: '辰',
  乙: '卯',
  丙: '寅',
  丁: '亥',
  戊: '寅',
  己: '亥',
  庚: '申',
  辛: '酉',
  壬: '戌',
  癸: '未',
};

/**
 * 文曲貴人查詢表（又稱文曲星）
 * 以日干查詢
 */
const WENQU: Record<string, string> = {
  甲: '巳',
  乙: '午',
  丙: '申',
  丁: '酉',
  戊: '申',
  己: '酉',
  庚: '亥',
  辛: '子',
  壬: '寅',
  癸: '卯',
};

/**
 * 德秀貴人查詢表
 * 特定干支組合
 */
const DEXIU = {
  寅午戌月: { 干: '丙', 支: '丁' },
  申子辰月: { 干: '壬', 支: '癸' },
  亥卯未月: { 干: '甲', 支: '乙' },
  巳酉丑月: { 干: '庚', 支: '辛' },
};

/**
 * 歲破查詢表
 * 年支的對沖地支
 */
const SUIPO: Record<string, string> = {
  子: '午',
  丑: '未',
  寅: '申',
  卯: '酉',
  辰: '戌',
  巳: '亥',
  午: '子',
  未: '丑',
  申: '寅',
  酉: '卯',
  戌: '辰',
  亥: '巳',
};

/**
 * 喪門查詢表
 * 以年支查詢
 */
const SANGMEN: Record<string, string> = {
  子: '寅',
  丑: '卯',
  寅: '辰',
  卯: '巳',
  辰: '午',
  巳: '未',
  午: '申',
  未: '酉',
  申: '戌',
  酉: '亥',
  戌: '子',
  亥: '丑',
};

/**
 * 披麻查詢表
 * 以年支查詢
 */
const PIMA: Record<string, string> = {
  子: '亥',
  丑: '子',
  寅: '丑',
  卯: '寅',
  辰: '卯',
  巳: '辰',
  午: '巳',
  未: '午',
  申: '未',
  酉: '申',
  戌: '酉',
  亥: '戌',
};

/**
 * 白虎查詢表
 * 以年支查詢
 */
const BAIHU: Record<string, string> = {
  子: '申',
  丑: '酉',
  寅: '戌',
  卯: '亥',
  辰: '子',
  巳: '丑',
  午: '寅',
  未: '卯',
  申: '辰',
  酉: '巳',
  戌: '午',
  亥: '未',
};

/**
 * 官符查詢表
 * 以年支查詢
 */
const GUANFU: Record<string, string> = {
  子: '卯',
  丑: '辰',
  寅: '巳',
  卯: '午',
  辰: '未',
  巳: '申',
  午: '酉',
  未: '戌',
  申: '亥',
  酉: '子',
  戌: '丑',
  亥: '寅',
};

/**
 * 五鬼查詢表
 * 以年支查詢
 */
const WUGUI: Record<string, string> = {
  子: '辰',
  丑: '巳',
  寅: '午',
  卯: '未',
  辰: '申',
  巳: '酉',
  午: '戌',
  未: '亥',
  申: '子',
  酉: '丑',
  戌: '寅',
  亥: '卯',
};

/**
 * 死符查詢表
 * 以年支查詢
 */
const SIFU: Record<string, string> = {
  子: '巳',
  丑: '午',
  寅: '未',
  卯: '申',
  辰: '酉',
  巳: '戌',
  午: '亥',
  未: '子',
  申: '丑',
  酉: '寅',
  戌: '卯',
  亥: '辰',
};

/**
 * 歲德查詢表
 * 以年干查詢
 */
const SUIDE: Record<string, string> = {
  甲: '艮',
  乙: '坤',
  丙: '巽',
  丁: '離',
  戊: '坤',
  己: '坎',
  庚: '乾',
  辛: '兌',
  壬: '艮',
  癸: '離',
};

/**
 * 龍德查詢表
 * 以月支查詢
 */
const LONGDE: Record<string, string> = {
  寅: '亥',
  卯: '子',
  辰: '丑',
  巳: '寅',
  午: '卯',
  未: '辰',
  申: '巳',
  酉: '午',
  戌: '未',
  亥: '申',
  子: '酉',
  丑: '戌',
};

/**
 * 孤鸞煞查詢表
 * 特定日柱組合
 */
const GULUAN: string[] = [
  '乙巳',
  '丁巳',
  '辛亥',
  '戊申',
  '壬寅',
  '戊午',
  '壬子',
  '丙午',
  '丙子',
];

/**
 * 四廢查詢表
 * 特定季節日柱組合
 */
const SIFEI = {
  春: ['庚申', '辛酉'], // 春季金無氣
  夏: ['壬子', '癸亥'], // 夏季水無氣
  秋: ['甲寅', '乙卯'], // 秋季木無氣
  冬: ['丙午', '丁巳'], // 冬季火無氣
};

/**
 * 天元坐煞查詢表
 * 特定日柱組合
 */
const TIANYUAN_ZUOSHA: string[] = [
  '甲申',
  '乙酉',
  '丙子',
  '丁亥',
  '戊寅',
  '己卯',
  '庚午',
  '辛巳',
  '壬申',
  '癸酉',
];

/**
 * 金神查詢表
 * 特定時柱組合
 */
const JINSHEN: string[] = ['乙丑', '己巳', '癸酉'];

/**
 * 三刑查詢
 * 地支刑關係
 */
const SANXING = {
  寅巳申: ['寅', '巳', '申'], // 寅巳申三刑（恃勢之刑）
  丑戌未: ['丑', '戌', '未'], // 丑戌未三刑（無恩之刑）
  子卯: ['子', '卯'], // 子卯相刑（無禮之刑）
};

/**
 * 自刑地支
 */
const ZIXING: string[] = ['辰', '午', '酉', '亥'];

/**
 * 六害查詢表
 * 地支相害關係
 */
const LIUHAI: Record<string, string> = {
  子: '未',
  丑: '午',
  寅: '巳',
  卯: '辰',
  申: '亥',
  酉: '戌',
  未: '子',
  午: '丑',
  巳: '寅',
  辰: '卯',
  亥: '申',
  戌: '酉',
};

/**
 * 貫索查詢表
 * 以年支查詢
 */
const GUANSUO: Record<string, string> = {
  子: '丑',
  丑: '寅',
  寅: '卯',
  卯: '辰',
  辰: '巳',
  巳: '午',
  午: '未',
  未: '申',
  申: '酉',
  酉: '戌',
  戌: '亥',
  亥: '子',
};

/**
 * 飛廉查詢表
 * 以年支查詢
 */
const FEILIAN: Record<string, string> = {
  子: '酉',
  丑: '戌',
  寅: '亥',
  卯: '子',
  辰: '丑',
  巳: '寅',
  午: '卯',
  未: '辰',
  申: '巳',
  酉: '午',
  戌: '未',
  亥: '申',
};

/**
 * 羅睺查詢表
 * 以年支查詢
 */
const LUOHOU: Record<string, string> = {
  子: '巳',
  丑: '午',
  寅: '未',
  卯: '申',
  辰: '酉',
  巳: '戌',
  午: '亥',
  未: '子',
  申: '丑',
  酉: '寅',
  戌: '卯',
  亥: '辰',
};

/**
 * 計都查詢表
 * 以年支查詢
 */
const JIDU: Record<string, string> = {
  子: '亥',
  丑: '子',
  寅: '丑',
  卯: '寅',
  辰: '卯',
  巳: '辰',
  午: '巳',
  未: '午',
  申: '未',
  酉: '申',
  戌: '酉',
  亥: '戌',
};

/**
 * 天哭查詢表
 * 以年支查詢
 */
const TIANKU: Record<string, string> = {
  子: '戌',
  丑: '亥',
  寅: '子',
  卯: '丑',
  辰: '寅',
  巳: '卯',
  午: '辰',
  未: '巳',
  申: '午',
  酉: '未',
  戌: '申',
  亥: '酉',
};

/**
 * 天虛查詢表
 * 以年支查詢
 */
const TIANXU: Record<string, string> = {
  子: '未',
  丑: '申',
  寅: '酉',
  卯: '戌',
  辰: '亥',
  巳: '子',
  午: '丑',
  未: '寅',
  申: '卯',
  酉: '辰',
  戌: '巳',
  亥: '午',
};

/**
 * 紫微查詢表
 * 以年支查詢
 */
const ZIWEI: Record<string, string> = {
  子: '卯',
  丑: '寅',
  寅: '丑',
  卯: '子',
  辰: '亥',
  巳: '戌',
  午: '酉',
  未: '申',
  申: '未',
  酉: '午',
  戌: '巳',
  亥: '辰',
};

/**
 * 鳳閣查詢表
 * 以月支查詢
 */
const FENGGE: Record<string, string> = {
  寅: '巳',
  卯: '午',
  辰: '未',
  巳: '申',
  午: '酉',
  未: '戌',
  申: '亥',
  酉: '子',
  戌: '丑',
  亥: '寅',
  子: '卯',
  丑: '辰',
};

/**
 * 月將查詢表
 * 以月支查詢
 */
const YUEJIANG: Record<string, string> = {
  寅: '酉',
  卯: '戌',
  辰: '亥',
  巳: '子',
  午: '丑',
  未: '寅',
  申: '卯',
  酉: '辰',
  戌: '巳',
  亥: '午',
  子: '未',
  丑: '申',
};

/**
 * 豹尾查詢表
 * 歲破後兩位
 */
const BAOWEI: Record<string, string> = {
  子: '申',
  丑: '酉',
  寅: '戌',
  卯: '亥',
  辰: '子',
  巳: '丑',
  午: '寅',
  未: '卯',
  申: '辰',
  酉: '巳',
  戌: '午',
  亥: '未',
};

/**
 * 黃幡查詢表
 * 以年支查詢
 */
const HUANGFAN: Record<string, string> = {
  子: '未',
  丑: '申',
  寅: '酉',
  卯: '戌',
  辰: '亥',
  巳: '子',
  午: '丑',
  未: '寅',
  申: '卯',
  酉: '辰',
  戌: '巳',
  亥: '午',
};

/**
 * 將軍箭查詢表
 * 以年支和時辰查詢（小兒關煞）
 */
const JIANGJUNJIAN = {
  春: ['酉', '戌', '未'], // 春季生人忌酉戌未時
  夏: ['子', '午', '卯'], // 夏季生人忌子午卯時
  秋: ['卯', '辰', '丑'], // 秋季生人忌卯辰丑時
  冬: ['午', '酉', '戌'], // 冬季生人忌午酉戌時
};

/**
 * 鐵掃帚查詢表
 * 以月支查詢，男女不同
 */
const TIESAZHOU_MALE: Record<string, string> = {
  子: '申',
  丑: '酉',
  寅: '戌',
  卯: '亥',
  辰: '子',
  巳: '丑',
  午: '寅',
  未: '卯',
  申: '辰',
  酉: '巳',
  戌: '午',
  亥: '未',
};

const TIESAZHOU_FEMALE: Record<string, string> = {
  子: '辰',
  丑: '巳',
  寅: '午',
  卯: '未',
  辰: '申',
  巳: '酉',
  午: '戌',
  未: '亥',
  申: '子',
  酉: '丑',
  戌: '寅',
  亥: '卯',
};

/**
 * 九醜查詢表
 * 特定日柱組合
 */
const JIUCHOU: string[] = [
  '庚戌',
  '辛亥',
  '壬寅',
  '癸巳',
  '丁丑',
  '戊子',
  '己卯',
];

/**
 * 闌干查詢表
 * 以年支查詢
 */
const LANGAN: Record<string, string> = {
  子: '卯',
  丑: '辰',
  寅: '巳',
  卯: '午',
  辰: '未',
  巳: '申',
  午: '酉',
  未: '戌',
  申: '亥',
  酉: '子',
  戌: '丑',
  亥: '寅',
};

/**
 * 暴敗查詢表
 * 以日柱查詢
 */
const BAOBAI: string[] = [
  '甲辰',
  '乙巳',
  '丙申',
  '丁亥',
  '戊戌',
  '己丑',
  '庚辰',
  '辛巳',
  '壬申',
  '癸亥',
];

/**
 * 浮沉查詢表
 * 以年支查詢
 */
const FUCHEN: Record<string, string> = {
  子: '巳',
  丑: '午',
  寅: '未',
  卯: '申',
  辰: '酉',
  巳: '戌',
  午: '亥',
  未: '子',
  申: '丑',
  酉: '寅',
  戌: '卯',
  亥: '辰',
};

/**
 * 指背查詢表
 * 以年支查詢
 */
const ZHIBEI: Record<string, string> = {
  子: '巳',
  丑: '午',
  寅: '未',
  卯: '申',
  辰: '酉',
  巳: '戌',
  午: '亥',
  未: '子',
  申: '丑',
  酉: '寅',
  戌: '卯',
  亥: '辰',
};

/**
 * 捲舌查詢表
 * 以年支查詢
 */
const JUANSHE: Record<string, string> = {
  子: '戌',
  丑: '亥',
  寅: '子',
  卯: '丑',
  辰: '寅',
  巳: '卯',
  午: '辰',
  未: '巳',
  申: '午',
  酉: '未',
  戌: '申',
  亥: '酉',
};

/**
 * 伏屍查詢表
 * 以年支查詢
 */
const FUSHI: Record<string, string> = {
  子: '亥',
  丑: '子',
  寅: '丑',
  卯: '寅',
  辰: '卯',
  巳: '辰',
  午: '巳',
  未: '午',
  申: '未',
  酉: '申',
  戌: '酉',
  亥: '戌',
};

/**
 * 吞陷煞查詢表
 * 以日干查詢
 */
const TUNXIAN: Record<string, string> = {
  甲: '辰',
  乙: '辰',
  丙: '戌',
  丁: '戌',
  戊: '辰',
  己: '辰',
  庚: '戌',
  辛: '戌',
  壬: '辰',
  癸: '辰',
};

/**
 * 破碎煞查詢表
 * 以年支查詢
 */
const POSUI: Record<string, string> = {
  子: '巳',
  丑: '辰',
  寅: '酉',
  卯: '子',
  辰: '酉',
  巳: '申',
  午: '酉',
  未: '戌',
  申: '巳',
  酉: '子',
  戌: '未',
  亥: '寅',
};

/**
 * 往亡查詢表
 * 以日支查詢
 */
const WANGWANG: Record<string, string> = {
  子: '巳',
  丑: '午',
  寅: '未',
  卯: '申',
  辰: '酉',
  巳: '戌',
  午: '亥',
  未: '子',
  申: '丑',
  酉: '寅',
  戌: '卯',
  亥: '辰',
};

/**
 * 歸忌查詢表
 * 以日支查詢
 */
const GUIJI: Record<string, string> = {
  子: '未',
  丑: '申',
  寅: '酉',
  卯: '戌',
  辰: '亥',
  巳: '子',
  午: '丑',
  未: '寅',
  申: '卯',
  酉: '辰',
  戌: '巳',
  亥: '午',
};

/**
 * 天火查詢表
 * 以日干查詢
 */
const TIANHUO: Record<string, string> = {
  甲: '子',
  乙: '卯',
  丙: '午',
  丁: '酉',
  戊: '子',
  己: '卯',
  庚: '午',
  辛: '酉',
  壬: '子',
  癸: '卯',
};

/**
 * 劍鋒煞查詢表
 * 以日干查詢
 */
const JIANFENG: Record<string, string> = {
  甲: '酉',
  乙: '戌',
  丙: '子',
  丁: '丑',
  戊: '卯',
  己: '辰',
  庚: '午',
  辛: '未',
  壬: '酉',
  癸: '戌',
};

/**
 * 懸針煞查詢表
 * 特定日柱組合
 */
const XUANZHEN: string[] = [
  '甲寅',
  '乙卯',
  '丙午',
  '丁巳',
  '戊戌',
  '己未',
  '庚申',
  '辛酉',
  '壬子',
  '癸亥',
];

/**
 * 平頭煞查詢表
 * 特定日柱組合（干支五行相剋）
 */
const PINGTOU: string[] = [
  '甲申',
  '甲戌',
  '乙酉',
  '乙亥',
  '丙子',
  '丙寅',
  '丁丑',
  '丁卯',
  '戊辰',
  '戊午',
  '己巳',
  '己未',
  '庚午',
  '庚申',
  '辛未',
  '辛酉',
  '壬申',
  '壬戌',
  '癸酉',
  '癸亥',
];

/**
 * 六厄查詢表
 * 以年支查詢
 */
const LIUE: Record<string, string> = {
  子: '卯',
  丑: '辰',
  寅: '巳',
  卯: '午',
  辰: '未',
  巳: '申',
  午: '酉',
  未: '戌',
  申: '亥',
  酉: '子',
  戌: '丑',
  亥: '寅',
};

/**
 * 歲刑查詢表
 * 以年支查詢
 */
const SUIXING: Record<string, string[]> = {
  子: ['卯'],
  丑: ['戌', '未'],
  寅: ['巳', '申'],
  卯: ['子'],
  辰: ['辰'],
  巳: ['寅', '申'],
  午: ['午'],
  未: ['丑', '戌'],
  申: ['寅', '巳'],
  酉: ['酉'],
  戌: ['丑', '未'],
  亥: ['亥'],
};

/**
 * 博士十二神查詢表
 * 以月支起，順行至日支
 */
const BOSHI_12: string[] = [
  '博士',
  '力士',
  '青龍',
  '小耗',
  '將軍',
  '奏書',
  '飛廉',
  '喜神',
  '病符',
  '大耗',
  '伏兵',
  '官符',
];

/**
 * 牆內桃花：日支為桃花
 */
const QIANGNEII_TAOHUA = (dayBranch: string, taohuaBranch: string): boolean => {
  return dayBranch === taohuaBranch;
};

/**
 * 牆外桃花：時支為桃花
 */
const QIANGWAI_TAOHUA = (hourBranch: string, taohuaBranch: string): boolean => {
  return hourBranch === taohuaBranch;
};

/**
 * 遍野桃花：月支為桃花
 */
const BIANYE_TAOHUA = (
  monthBranch: string,
  taohuaBranch: string
): boolean => {
  return monthBranch === taohuaBranch;
};

/**
 * 倒插桃花：年支為桃花
 */
const DAOCHA_TAOHUA = (yearBranch: string, taohuaBranch: string): boolean => {
  return yearBranch === taohuaBranch;
};

// 有效的天干和地支常量（用於輸入驗證）
const VALID_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const VALID_BRANCHES = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
];

/**
 * 驗證天干是否有效
 */
function isValidStem(stem: string): boolean {
  return VALID_STEMS.includes(stem);
}

/**
 * 驗證地支是否有效
 */
function isValidBranch(branch: string): boolean {
  return VALID_BRANCHES.includes(branch);
}

/**
 * 計算八字神煞
 * @param yearPillar 年柱
 * @param monthPillar 月柱
 * @param dayPillar 日柱
 * @param hourPillar 時柱
 * @returns 神煞列表
 */
export function calculateBaZiShenSha(
  yearPillar: Pillar,
  monthPillar: Pillar,
  dayPillar: Pillar,
  hourPillar: Pillar
): BaZiShenSha[] {
  const shenShaList: BaZiShenSha[] = [];
  const dayStem = dayPillar.heavenlyStem;
  const dayBranch = dayPillar.earthlyBranch;
  const yearBranch = yearPillar.earthlyBranch;
  const monthBranch = monthPillar.earthlyBranch;
  const hourBranch = hourPillar.earthlyBranch;

  // 輸入驗證：檢查所有天干地支是否有效
  const stems = [
    { value: yearPillar.heavenlyStem, name: '年干' },
    { value: monthPillar.heavenlyStem, name: '月干' },
    { value: dayStem, name: '日干' },
    { value: hourPillar.heavenlyStem, name: '時干' },
  ];
  const branches = [
    { value: yearBranch, name: '年支' },
    { value: monthBranch, name: '月支' },
    { value: dayBranch, name: '日支' },
    { value: hourBranch, name: '時支' },
  ];

  for (const { value, name } of stems) {
    if (!isValidStem(value)) {
      console.warn(`神煞計算警告：無效的${name}「${value}」`);
      return []; // 返回空結果，避免計算錯誤
    }
  }

  for (const { value, name } of branches) {
    if (!isValidBranch(value)) {
      console.warn(`神煞計算警告：無效的${name}「${value}」`);
      return []; // 返回空結果，避免計算錯誤
    }
  }

  const allBranches = [
    { branch: yearBranch, position: '年柱' },
    { branch: monthBranch, position: '月柱' },
    { branch: dayBranch, position: '日柱' },
    { branch: hourBranch, position: '時柱' },
  ];

  const allStems = [
    { stem: yearPillar.heavenlyStem, position: '年柱' },
    { stem: monthPillar.heavenlyStem, position: '月柱' },
    { stem: dayPillar.heavenlyStem, position: '日柱' },
    { stem: hourPillar.heavenlyStem, position: '時柱' },
  ];

  // ========== 輔助函數 ==========

  /**
   * 查找地支匹配單一目標的柱位
   */
  const findBranchPositions = (target: string | undefined): string[] => {
    if (!target) return [];
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === target) {
        positions.push(position);
      }
    });
    return positions;
  };

  /**
   * 查找地支匹配多個目標的柱位（用於天乙貴人、太極貴人等）
   */
  const findBranchPositionsMultiple = (
    targets: string[] | undefined
  ): string[] => {
    if (!targets) return [];
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (targets.includes(branch)) {
        positions.push(position);
      }
    });
    return positions;
  };

  /**
   * 查找地支匹配日支或年支目標的柱位（用於桃花、驛馬等）
   */
  const findBranchPositionsDual = (
    target1: string | undefined,
    target2: string | undefined
  ): string[] => {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === target1 || branch === target2) {
        if (!positions.includes(position)) {
          positions.push(position);
        }
      }
    });
    return positions;
  };

  /**
   * 添加神煞到列表（如果有匹配的柱位）
   */
  const addShenSha = (
    positions: string[],
    name: string,
    type: '吉' | '凶' | '中',
    description: string
  ): void => {
    if (positions.length > 0) {
      shenShaList.push({ name, type, description, positions });
    }
  };

  /**
   * 查找天干匹配目標的柱位
   */
  const findStemPositions = (target: string | undefined): string[] => {
    if (!target) return [];
    const positions: string[] = [];
    allStems.forEach(({ stem, position }) => {
      if (stem === target) {
        positions.push(position);
      }
    });
    return positions;
  };

  /**
   * 查找地支匹配目標的柱位（排除指定柱位）
   */
  const findBranchPositionsExclude = (
    target: string | undefined,
    excludePosition: string
  ): string[] => {
    if (!target) return [];
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === target && position !== excludePosition) {
        positions.push(position);
      }
    });
    return positions;
  };

  // ========== 神煞計算 ==========

  // 1. 天乙貴人（以日干查，看其他柱地支）
  addShenSha(
    findBranchPositionsMultiple(TIANYI_GUIREN[dayStem]),
    '天乙貴人',
    '吉',
    '逢凶化吉、遇難呈祥，主貴人相助'
  );

  // 2. 文昌貴人（以日干查）
  addShenSha(
    findBranchPositions(WENCHANG[dayStem]),
    '文昌貴人',
    '吉',
    '主聰明智慧、學業有成、利於考試'
  );

  // 3. 桃花（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(TAOHUA[dayBranch], TAOHUA[yearBranch]),
    '桃花',
    '中',
    '主人緣佳、異性緣好，但須防桃色糾紛'
  );

  // 4. 驛馬（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(YIMA[dayBranch], YIMA[yearBranch]),
    '驛馬',
    '中',
    '主奔波勞碌、適合外出發展、有遷移變動'
  );

  // 5. 華蓋（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(HUAGAI[dayBranch], HUAGAI[yearBranch]),
    '華蓋',
    '中',
    '主聰明孤傲、適合藝術宗教、喜獨處研究'
  );

  // 6. 將星（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(JIANGXING[dayBranch], JIANGXING[yearBranch]),
    '將星',
    '吉',
    '主領導能力強、有權威、適合管理職位'
  );

  // 7. 祿神（以日干查）
  addShenSha(
    findBranchPositions(LUSHEN[dayStem]),
    '祿神',
    '吉',
    '主衣食無憂、財祿豐厚、福氣綿長'
  );

  // 8. 羊刃（以日干查，陽干才有）
  addShenSha(
    findBranchPositions(YANGREN[dayStem]),
    '羊刃',
    '凶',
    '主性格剛烈、易有血光之災、須防意外傷害'
  );

  // 9. 天德貴人（以月支查，看四柱天干和地支）
  const tiandeTarget = TIANDE[monthBranch];
  if (tiandeTarget) {
    const stemPos = findStemPositions(tiandeTarget);
    const branchPos = findBranchPositions(tiandeTarget);
    const combinedPos = [...new Set([...stemPos, ...branchPos])];
    addShenSha(combinedPos, '天德貴人', '吉', '主逢凶化吉、一生平安、有貴人扶持');
  }

  // 10. 月德貴人（以月支查，看四柱天干）
  addShenSha(
    findStemPositions(YUEDE[monthBranch]),
    '月德貴人',
    '吉',
    '主品德高尚、處事平順、有福德庇佑'
  );

  // 11. 金輿（以日干查）
  addShenSha(
    findBranchPositions(JINYU[dayStem]),
    '金輿',
    '吉',
    '主出行平安、有車馬之福、利於交通'
  );

  // 12. 劫煞（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(JIESHA[dayBranch], JIESHA[yearBranch]),
    '劫煞',
    '凶',
    '主易有劫難、須防小人暗害、謹慎理財'
  );

  // 13. 亡神（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(WANGSHEN[dayBranch], WANGSHEN[yearBranch]),
    '亡神',
    '凶',
    '主心神不寧、易有是非口舌、須防暗耗'
  );

  // 14. 孤辰（以年支查，排除年柱）
  addShenSha(
    findBranchPositionsExclude(GUCHEN[yearBranch], '年柱'),
    '孤辰',
    '凶',
    '主孤獨寂寞、男命克妻、宜晚婚'
  );

  // 15. 寡宿（以年支查，排除年柱）
  addShenSha(
    findBranchPositionsExclude(GUASU[yearBranch], '年柱'),
    '寡宿',
    '凶',
    '主孤獨寂寞、女命克夫、宜晚婚'
  );

  // 16. 天廚貴人（以日干查）
  addShenSha(
    findBranchPositions(TIANCHU[dayStem]),
    '天廚貴人',
    '吉',
    '主食祿豐厚、衣食無缺、生活富足'
  );

  // 17. 福星貴人（以日干查）
  addShenSha(
    findBranchPositions(FUXING[dayStem]),
    '福星貴人',
    '吉',
    '主福氣臨門、一生平安、遇事有救'
  );

  // 18. 國印貴人（以日干查）
  addShenSha(
    findBranchPositions(GUOYIN[dayStem]),
    '國印貴人',
    '吉',
    '主掌印信權柄、適合公職、有官運'
  );

  // 19. 學堂（以日干查）
  addShenSha(
    findBranchPositions(XUETANG[dayStem]),
    '學堂',
    '吉',
    '主聰明好學、學業有成、文采出眾'
  );

  // 20. 詞館（以日干查）
  addShenSha(
    findBranchPositions(CIGUAN[dayStem]),
    '詞館',
    '吉',
    '主文采斐然、能言善辯、利於文職'
  );

  // 21. 魁罡（以日柱干支組合查）
  const dayPillarStr = dayStem + dayBranch;
  if (KUIGANG.includes(dayPillarStr)) {
    addShenSha(['日柱'], '魁罡', '中', '主性格剛毅、有膽識魄力、但須防剛愎自用');
  }

  // 22. 天羅地網（辰戌同時出現）
  const tianluoPos = findBranchPositions(TIANLUODIWANG.天羅);
  const diwangPos = findBranchPositions(TIANLUODIWANG.地網);
  if (tianluoPos.length > 0 && diwangPos.length > 0) {
    addShenSha(
      [...new Set([...tianluoPos, ...diwangPos])],
      '天羅地網',
      '凶',
      '主易遇困阻、諸事不順、須防官非訴訟'
    );
  }

  // 23. 災煞（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(ZAISHA[dayBranch], ZAISHA[yearBranch]),
    '災煞',
    '凶',
    '主災禍臨身、須防水火之災、謹慎行事'
  );

  // 24. 天煞（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(TIANSHA[dayBranch], TIANSHA[yearBranch]),
    '天煞',
    '凶',
    '主意外災禍、須防飛來橫禍、宜謹慎'
  );

  // 25. 地煞（以日支或年支查）
  addShenSha(
    findBranchPositionsDual(DISHA[dayBranch], DISHA[yearBranch]),
    '地煞',
    '凶',
    '主地面災害、須防跌傷摔傷、出行謹慎'
  );

  // 26. 紅艷煞（以日干查）
  addShenSha(
    findBranchPositions(HONGYAN[dayStem]),
    '紅艷煞',
    '中',
    '主風流多情、異性緣佳、但須防感情糾葛'
  );

  // 27. 流霞煞（以日干查）
  addShenSha(
    findBranchPositions(LIUXIA[dayStem]),
    '流霞煞',
    '凶',
    '主血光之災、女命須防難產、男命防意外'
  );

  // 28. 血刃（以日干查）
  addShenSha(
    findBranchPositions(XUEREN[dayStem]),
    '血刃',
    '凶',
    '主血光之災、須防刀傷手術、謹慎行事'
  );

  // 29. 天醫（以月支查）
  addShenSha(
    findBranchPositions(TIANYI_DOCTOR[monthBranch]),
    '天醫',
    '吉',
    '主適合醫療行業、身體康健、逢病可癒'
  );

  // 30. 太極貴人（以日干查）
  addShenSha(
    findBranchPositionsMultiple(TAIJI[dayStem]),
    '太極貴人',
    '吉',
    '主近貴得福、智慧超群、適合玄學研究'
  );

  // 31. 三奇貴人
  const yearStem = yearPillar.heavenlyStem;
  const monthStem = monthPillar.heavenlyStem;
  const hourStem = hourPillar.heavenlyStem;
  const allStemValues = [yearStem, monthStem, dayStem, hourStem];
  const pillarNames = ['年柱', '月柱', '日柱', '時柱'];

  // 檢查三奇的輔助函數
  const findSanqiPositions = (
    order: string[]
  ): { found: boolean; positions: string[] } => {
    // 防禦性檢查：確保陣列長度一致且足夠
    if (
      allStemValues.length !== pillarNames.length ||
      allStemValues.length < 3
    ) {
      console.warn('神煞計算警告：三奇檢查時陣列長度不一致或不足');
      return { found: false, positions: [] };
    }

    for (let i = 0; i < allStemValues.length - 2; i++) {
      if (
        allStemValues[i] === order[0] &&
        allStemValues[i + 1] === order[1] &&
        allStemValues[i + 2] === order[2]
      ) {
        return {
          found: true,
          positions: [pillarNames[i], pillarNames[i + 1], pillarNames[i + 2]],
        };
      }
    }
    return { found: false, positions: [] };
  };

  // 檢查天上三奇（甲戊庚順序出現）
  const tianSanqiResult = findSanqiPositions(SANQI.天上三奇);
  if (tianSanqiResult.found) {
    shenShaList.push({
      name: '天上三奇',
      type: '吉',
      description: '主天賦異稟、聰明絕頂、適合研究學問',
      positions: tianSanqiResult.positions,
    });
  }

  // 檢查地上三奇（乙丙丁順序出現）
  const diSanqiResult = findSanqiPositions(SANQI.地上三奇);
  if (diSanqiResult.found) {
    shenShaList.push({
      name: '地上三奇',
      type: '吉',
      description: '主得地利之便、事業順遂、財運亨通',
      positions: diSanqiResult.positions,
    });
  }

  // 檢查人中三奇（壬癸辛順序出現）
  const renSanqiResult = findSanqiPositions(SANQI.人中三奇);
  if (renSanqiResult.found) {
    shenShaList.push({
      name: '人中三奇',
      type: '吉',
      description: '主人緣廣闊、貴人相助、處世圓融',
      positions: renSanqiResult.positions,
    });
  }

  // 32. 天喜（以年支查）
  addShenSha(
    findBranchPositions(TIANXI[yearBranch]),
    '天喜',
    '吉',
    '主喜事臨門、婚姻美滿、添丁進財'
  );

  // 33. 紅鸞（以年支查）
  addShenSha(
    findBranchPositions(HONGLUAN[yearBranch]),
    '紅鸞',
    '吉',
    '主姻緣和合、喜事連連、利於婚嫁'
  );

  // 34. 天赦（特定日柱與月支組合）
  for (const rule of TIANSHE) {
    if (
      rule.season.includes(monthBranch) &&
      dayStem === rule.dayStem &&
      dayBranch === rule.dayBranch
    ) {
      addShenSha(['日柱'], '天赦', '吉', '主逢凶化吉、罪過可赦、貴人相助');
      break;
    }
  }

  // 35. 陰陽差錯（特定日柱組合）
  if (YINYANG_CHACUO.includes(dayPillarStr)) {
    addShenSha(['日柱'], '陰陽差錯', '凶', '主婚姻不順、夫妻易有隔閡、感情多波折');
  }

  // 36. 十惡大敗（特定日柱組合）
  if (SHIE_DABAI.includes(dayPillarStr)) {
    addShenSha(['日柱'], '十惡大敗', '凶', '主錢財難聚、事業多阻、須防破敗');
  }

  // 37. 月德合（以月支查，看四柱天干）
  addShenSha(
    findStemPositions(YUEDE_HE[monthBranch]),
    '月德合',
    '吉',
    '主品德高尚、處事平順、為月德之合神'
  );

  // 38. 天德合（以月支查，看四柱天干）
  const tiandeHeTarget = TIANDE_HE[monthBranch];
  if (tiandeHeTarget) {
    addShenSha(
      findStemPositions(tiandeHeTarget),
      '天德合',
      '吉',
      '主逢凶化吉、貴人相助、為天德之合神'
    );
  }

  // 39. 六秀日（特定日柱組合）
  if (LIUXIU.includes(dayPillarStr)) {
    addShenSha(['日柱'], '六秀日', '吉', '主聰明秀氣、才華出眾、氣質非凡');
  }

  // 40. 八專日（特定日柱組合）
  if (BAZHUAN.includes(dayPillarStr)) {
    addShenSha(
      ['日柱'],
      '八專日',
      '中',
      '主專一之氣、性格執著、感情專注但須防固執'
    );
  }

  // 41. 弔客（以年支查）
  addShenSha(
    findBranchPositions(DIAOKE[yearBranch]),
    '弔客',
    '凶',
    '主喪服之事、須防親友有難、宜謹慎行事'
  );

  // 42. 天狗（以年支查）
  addShenSha(
    findBranchPositions(TIANGOU[yearBranch]),
    '天狗',
    '凶',
    '主是非口舌、易有意外、須防血光之災'
  );

  // 43. 截空/空亡（以日柱所在旬查）
  const xunShou = JIAZI_TO_XUN[dayPillarStr];
  if (xunShou) {
    const kongwangBranches = KONGWANG[xunShou];
    if (kongwangBranches) {
      const kongwangPositions: string[] = [];
      allBranches.forEach(({ branch, position }) => {
        if (kongwangBranches.includes(branch)) {
          kongwangPositions.push(position);
        }
      });
      addShenSha(
        kongwangPositions,
        '截空',
        '凶',
        '主空虛不實、事多阻滯、但亦主超脫世俗'
      );
    }
  }

  // 44. 沐浴（以日干查）
  addShenSha(
    findBranchPositions(MUYU[dayStem]),
    '沐浴',
    '中',
    '主風流多情、桃花旺盛、須防感情糾紛'
  );

  // 45. 月破（以月支查對沖）
  const yuepoTarget = YUEPO[monthBranch];
  if (yuepoTarget) {
    const yuepoPositions: string[] = [];
    // 月破是指日支或時支與月支對沖
    if (dayBranch === yuepoTarget) {
      yuepoPositions.push('日柱');
    }
    if (hourBranch === yuepoTarget) {
      yuepoPositions.push('時柱');
    }
    addShenSha(yuepoPositions, '月破', '凶', '主諸事不順、易有破敗、不宜進取');
  }

  // 46. 隔角（以年支查）
  const gejiaoBranches = GEJIAO[yearBranch];
  if (gejiaoBranches) {
    const gejiaoPositions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (gejiaoBranches.includes(branch) && position !== '年柱') {
        gejiaoPositions.push(position);
      }
    });
    addShenSha(gejiaoPositions, '隔角', '凶', '主六親緣薄、易有隔閡、人際關係需注意');
  }

  // 47. 元辰（以年支查，陽年男/陰年女用YANG表，陰年男/陽年女用YIN表）
  // 注意：此處簡化處理，同時檢查兩種情況
  const yuanchenYangTarget = YUANCHEN_YANG[yearBranch];
  const yuanchenYinTarget = YUANCHEN_YIN[yearBranch];
  const yuanchenPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (
      (yuanchenYangTarget && branch === yuanchenYangTarget) ||
      (yuanchenYinTarget && branch === yuanchenYinTarget)
    ) {
      if (!yuanchenPositions.includes(position)) {
        yuanchenPositions.push(position);
      }
    }
  });
  addShenSha(yuanchenPositions, '元辰', '凶', '主耗散破敗、諸事不順、須謹慎理財');

  // 48. 玉堂貴人（以日干查）
  addShenSha(
    findBranchPositions(YUTANG[dayStem]),
    '玉堂貴人',
    '吉',
    '主福祿雙全、名利雙收、有貴人提攜'
  );

  // 49. 文曲貴人（以日干查）
  addShenSha(
    findBranchPositions(WENQU[dayStem]),
    '文曲貴人',
    '吉',
    '主文采出眾、才思敏捷、利於科舉考試'
  );

  // 50. 建祿（祿神在月柱）
  const lushenTarget = LUSHEN[dayStem];
  if (lushenTarget && monthBranch === lushenTarget) {
    addShenSha(['月柱'], '建祿', '吉', '主自立成家、財祿豐盈、事業有成');
  }

  // 51. 歸祿（祿神在時柱）
  if (lushenTarget && hourBranch === lushenTarget) {
    addShenSha(['時柱'], '歸祿', '吉', '主晚年富貴、子孫賢孝、福祿歸身');
  }

  // 52. 專祿（祿神在日支）
  if (lushenTarget && dayBranch === lushenTarget) {
    addShenSha(['日柱'], '專祿', '吉', '主專心事業、財祿專一、不宜投機');
  }

  // 53. 歲破（年支對沖）
  const suipoTarget = SUIPO[yearBranch];
  if (suipoTarget) {
    const suipoPositions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === suipoTarget && position !== '年柱') {
        suipoPositions.push(position);
      }
    });
    addShenSha(suipoPositions, '歲破', '凶', '主破耗損財、諸事不順、宜守不宜攻');
  }

  // 54. 大耗（歲破後一位）
  const dahaoPos = findBranchPositions(
    VALID_BRANCHES[
      (VALID_BRANCHES.indexOf(suipoTarget) + 1) % VALID_BRANCHES.length
    ]
  );
  if (dahaoPos.length > 0) {
    addShenSha(dahaoPos, '大耗', '凶', '主財物耗損、破財敗業、須防盜竊');
  }

  // 55. 小耗（歲破前一位）
  const xiaohaoPos = findBranchPositions(
    VALID_BRANCHES[
      (VALID_BRANCHES.indexOf(suipoTarget) + 11) % VALID_BRANCHES.length
    ]
  );
  if (xiaohaoPos.length > 0) {
    addShenSha(xiaohaoPos, '小耗', '凶', '主小破財、暗中耗損、宜節儉');
  }

  // 56. 喪門（以年支查）
  addShenSha(
    findBranchPositions(SANGMEN[yearBranch]),
    '喪門',
    '凶',
    '主喪服之事、須防孝服、家宅不寧'
  );

  // 57. 披麻（以年支查）
  addShenSha(
    findBranchPositions(PIMA[yearBranch]),
    '披麻',
    '凶',
    '主麻煩纏身、須防孝服、憂患多見'
  );

  // 58. 白虎（以年支查）
  addShenSha(
    findBranchPositions(BAIHU[yearBranch]),
    '白虎',
    '凶',
    '主血光意外、須防刀傷車禍、宜謹慎行事'
  );

  // 59. 官符（以年支查）
  addShenSha(
    findBranchPositions(GUANFU[yearBranch]),
    '官符',
    '凶',
    '主官非訴訟、須防口舌是非、避免爭執'
  );

  // 60. 五鬼（以年支查）
  addShenSha(
    findBranchPositions(WUGUI[yearBranch]),
    '五鬼',
    '凶',
    '主小人暗害、是非口舌、須防陰謀詭計'
  );

  // 61. 死符（以年支查）
  addShenSha(
    findBranchPositions(SIFU[yearBranch]),
    '死符',
    '凶',
    '主疾病纏身、健康不佳、須注意保養'
  );

  // 62. 龍德（以月支查）
  addShenSha(
    findBranchPositions(LONGDE[monthBranch]),
    '龍德',
    '吉',
    '主逢凶化吉、龍德庇佑、遇難呈祥'
  );

  // 63. 孤鸞煞（特定日柱）
  if (GULUAN.includes(dayPillarStr)) {
    addShenSha(['日柱'], '孤鸞煞', '凶', '主婚姻不順、夫妻易分離、宜晚婚');
  }

  // 64. 四廢（特定季節日柱）
  const seasonMap: Record<string, '春' | '夏' | '秋' | '冬'> = {
    寅: '春',
    卯: '春',
    辰: '春',
    巳: '夏',
    午: '夏',
    未: '夏',
    申: '秋',
    酉: '秋',
    戌: '秋',
    亥: '冬',
    子: '冬',
    丑: '冬',
  };
  const season = seasonMap[monthBranch];
  if (season && SIFEI[season].includes(dayPillarStr)) {
    addShenSha(['日柱'], '四廢', '凶', '主力不從心、事業多阻、難有成就');
  }

  // 65. 天元坐煞（特定日柱）
  if (TIANYUAN_ZUOSHA.includes(dayPillarStr)) {
    addShenSha(['日柱'], '天元坐煞', '凶', '主性格急躁、易有衝突、須防意外');
  }

  // 66. 金神（特定時柱）
  const hourPillarStr = hourPillar.heavenlyStem + hourPillar.earthlyBranch;
  if (JINSHEN.includes(hourPillarStr)) {
    addShenSha(['時柱'], '金神', '中', '主性格剛毅、有煞氣、須見火制化為吉');
  }

  // 67. 三刑
  // 檢查寅巳申三刑
  const yinSiShenCount = allBranches.filter(({ branch }) =>
    SANXING.寅巳申.includes(branch)
  ).length;
  if (yinSiShenCount >= 3) {
    const positions = allBranches
      .filter(({ branch }) => SANXING.寅巳申.includes(branch))
      .map(({ position }) => position);
    addShenSha(positions, '三刑', '凶', '主刑傷災禍、須防意外傷害、宜謹慎行事');
  }

  // 檢查丑戌未三刑
  const chouXuWeiCount = allBranches.filter(({ branch }) =>
    SANXING.丑戌未.includes(branch)
  ).length;
  if (chouXuWeiCount >= 3) {
    const positions = allBranches
      .filter(({ branch }) => SANXING.丑戌未.includes(branch))
      .map(({ position }) => position);
    addShenSha(positions, '三刑', '凶', '主刑傷災禍、六親不和、宜修養德行');
  }

  // 檢查子卯相刑
  const ziMaoPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (SANXING.子卯.includes(branch)) {
      ziMaoPositions.push(position);
    }
  });
  if (ziMaoPositions.length >= 2) {
    addShenSha(ziMaoPositions, '子卯相刑', '凶', '主無禮之刑、易有口舌是非');
  }

  // 68. 自刑
  const zixingPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (ZIXING.includes(branch)) {
      // 檢查是否有重複的自刑地支
      const count = allBranches.filter((b) => b.branch === branch).length;
      if (count >= 2 && !zixingPositions.includes(position)) {
        zixingPositions.push(position);
      }
    }
  });
  if (zixingPositions.length > 0) {
    addShenSha(zixingPositions, '自刑', '凶', '主自我刑傷、心性不定、易鑽牛角尖');
  }

  // 69. 六害
  const liuhaiPositions: string[] = [];
  allBranches.forEach(({ branch: branch1, position: position1 }) => {
    const harmBranch = LIUHAI[branch1];
    allBranches.forEach(({ branch: branch2, position: position2 }) => {
      if (
        branch2 === harmBranch &&
        position1 !== position2 &&
        !liuhaiPositions.includes(position1)
      ) {
        liuhaiPositions.push(position1);
      }
    });
  });
  if (liuhaiPositions.length > 0) {
    addShenSha(liuhaiPositions, '六害', '凶', '主六親不和、易有害人之事、防小人');
  }

  // 70. 貫索（以年支查）
  addShenSha(
    findBranchPositions(GUANSUO[yearBranch]),
    '貫索',
    '凶',
    '主牢獄之災、官非纏身、須防訴訟'
  );

  // 71. 飛廉（以年支查）
  addShenSha(
    findBranchPositions(FEILIAN[yearBranch]),
    '飛廉',
    '凶',
    '主奔波勞碌、東奔西走、難得安寧'
  );

  // 72. 羅睺（以年支查）
  addShenSha(
    findBranchPositions(LUOHOU[yearBranch]),
    '羅睺',
    '凶',
    '主陰謀詭計、暗中破害、須防小人'
  );

  // 73. 計都（以年支查）
  addShenSha(
    findBranchPositions(JIDU[yearBranch]),
    '計都',
    '凶',
    '主計謀多端、心機深沉、須防陰謀'
  );

  // 74. 天哭（以年支查）
  addShenSha(
    findBranchPositions(TIANKU[yearBranch]),
    '天哭',
    '凶',
    '主悲傷哭泣、憂鬱多愁、須防憂患'
  );

  // 75. 天虛（以年支查）
  addShenSha(
    findBranchPositions(TIANXU[yearBranch]),
    '天虛',
    '凶',
    '主虛耗不實、事多落空、難有實效'
  );

  // 76. 紫微（以年支查）
  addShenSha(
    findBranchPositions(ZIWEI[yearBranch]),
    '紫微',
    '吉',
    '主尊貴顯赫、權威在握、利於仕途'
  );

  // 77. 鳳閣（以月支查）
  addShenSha(
    findBranchPositions(FENGGE[monthBranch]),
    '鳳閣',
    '吉',
    '主文采風流、氣質優雅、利於文職'
  );

  // 78. 月將（以月支查）
  addShenSha(
    findBranchPositions(YUEJIANG[monthBranch]),
    '月將',
    '吉',
    '主領導統御、權威在握、利於管理'
  );

  // 79. 豹尾（歲破後兩位）
  addShenSha(
    findBranchPositions(BAOWEI[yearBranch]),
    '豹尾',
    '凶',
    '主凶惡暴戾、易有血光、須防意外'
  );

  // 80. 黃幡（以年支查）
  addShenSha(
    findBranchPositions(HUANGFAN[yearBranch]),
    '黃幡',
    '凶',
    '主喪服之事、須防孝服、家宅不安'
  );

  // 81. 飛刃（羊刃對沖）
  const yangrenTarget = YANGREN[dayStem];
  if (yangrenTarget) {
    const feirenTarget = SUIPO[yangrenTarget];
    if (feirenTarget) {
      addShenSha(
        findBranchPositions(feirenTarget),
        '飛刃',
        '凶',
        '主血光意外、須防刀傷手術、宜謹慎'
      );
    }
  }

  // 82. 伏吟（同柱重複）
  const fuyinPositions: string[] = [];
  const branchCounts: Record<string, { count: number; positions: string[] }> =
    {};
  allBranches.forEach(({ branch, position }) => {
    if (!branchCounts[branch]) {
      branchCounts[branch] = { count: 0, positions: [] };
    }
    branchCounts[branch].count++;
    branchCounts[branch].positions.push(position);
  });
  Object.entries(branchCounts).forEach(([branch, data]) => {
    if (data.count >= 2) {
      fuyinPositions.push(...data.positions);
    }
  });
  if (fuyinPositions.length > 0) {
    addShenSha(
      [...new Set(fuyinPositions)],
      '伏吟',
      '凶',
      '主重複不順、事多反覆、難有進展'
    );
  }

  // 83. 反吟（天克地沖）
  const fanyinPositions: string[] = [];
  for (let i = 0; i < allBranches.length; i++) {
    for (let j = i + 1; j < allBranches.length; j++) {
      const branch1 = allBranches[i].branch;
      const branch2 = allBranches[j].branch;
      if (SUIPO[branch1] === branch2) {
        fanyinPositions.push(allBranches[i].position);
        fanyinPositions.push(allBranches[j].position);
      }
    }
  }
  if (fanyinPositions.length > 0) {
    addShenSha(
      [...new Set(fanyinPositions)],
      '反吟',
      '凶',
      '主變動不安、事多反覆、宜靜不宜動'
    );
  }

  // 84. 鐵掃帚（以月支查，需要性別資訊）
  // 注意：此處無法獲取性別資訊，需要在調用時傳入或從其他地方獲取
  // 暫時使用男命規則
  addShenSha(
    findBranchPositions(TIESAZHOU_MALE[monthBranch]),
    '鐵掃帚',
    '凶',
    '主破財敗業、錢財難聚、宜節儉'
  );

  // 85. 截路空亡（四大空亡之一）
  const jieluKongwangPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    // 甲子旬戌亥空，在時柱為截路空亡
    if (position === '時柱') {
      if (xunShou) {
        const kongwangBranches = KONGWANG[xunShou];
        if (kongwangBranches && kongwangBranches.includes(branch)) {
          jieluKongwangPositions.push(position);
        }
      }
    }
  });
  if (jieluKongwangPositions.length > 0) {
    addShenSha(jieluKongwangPositions, '截路空亡', '凶', '主前路受阻、難有發展');
  }

  // 86. 九醜（特定日柱）
  if (JIUCHOU.includes(dayPillarStr)) {
    addShenSha(['日柱'], '九醜', '凶', '主容貌不佳、氣質欠佳、宜修養德行');
  }

  // 87. 闌干（以年支查）
  addShenSha(
    findBranchPositions(LANGAN[yearBranch]),
    '闌干',
    '凶',
    '主阻隔不通、事多障礙、難有突破'
  );

  // 88. 暴敗（特定日柱）
  if (BAOBAI.includes(dayPillarStr)) {
    addShenSha(['日柱'], '暴敗', '凶', '主突然敗落、錢財難守、宜謹慎');
  }

  // 89. 浮沉（以年支查）
  addShenSha(
    findBranchPositions(FUCHEN[yearBranch]),
    '浮沉',
    '凶',
    '主浮沉不定、事業起伏、難有穩定'
  );

  // 90. 指背（以年支查）
  addShenSha(
    findBranchPositions(ZHIBEI[yearBranch]),
    '指背',
    '凶',
    '主背後是非、易遭誹謗、須防小人'
  );

  // 91. 捲舌（以年支查）
  addShenSha(
    findBranchPositions(JUANSHE[yearBranch]),
    '捲舌',
    '凶',
    '主口舌是非、言語不慎、易惹爭端'
  );

  // 92. 伏屍（以年支查）
  addShenSha(
    findBranchPositions(FUSHI[yearBranch]),
    '伏屍',
    '凶',
    '主疾病纏身、健康不佳、須注意保養'
  );

  // 93. 吞陷煞（以日干查）
  addShenSha(
    findBranchPositions(TUNXIAN[dayStem]),
    '吞陷煞',
    '凶',
    '主陷入困境、難以自拔、須謹慎行事'
  );

  // 94. 破碎煞（以年支查）
  addShenSha(
    findBranchPositions(POSUI[yearBranch]),
    '破碎煞',
    '凶',
    '主破財損物、器物易損、宜小心保管'
  );

  // 95. 往亡（以日支查）
  addShenSha(
    findBranchPositions(WANGWANG[dayBranch]),
    '往亡',
    '凶',
    '主出行不利、易有意外、宜減少遠行'
  );

  // 96. 歸忌（以日支查）
  addShenSha(
    findBranchPositions(GUIJI[dayBranch]),
    '歸忌',
    '凶',
    '主回歸不利、返程多阻、宜慎重選擇'
  );

  // 97. 天火（以日干查）
  addShenSha(
    findBranchPositions(TIANHUO[dayStem]),
    '天火',
    '凶',
    '主火災之患、須防火燭、注意用火安全'
  );

  // 98. 劍鋒煞（以日干查）
  addShenSha(
    findBranchPositions(JIANFENG[dayStem]),
    '劍鋒煞',
    '凶',
    '主刀劍之災、須防意外傷害、宜謹慎'
  );

  // 99. 懸針煞（特定日柱）
  if (XUANZHEN.includes(dayPillarStr)) {
    addShenSha(['日柱'], '懸針煞', '凶', '主性格執著、易鑽牛角尖、須防固執');
  }

  // 100. 平頭煞（特定日柱）
  if (PINGTOU.includes(dayPillarStr)) {
    addShenSha(['日柱'], '平頭煞', '凶', '主干支相剋、內外不和、多有矛盾');
  }

  // 101. 六厄（以年支查）
  addShenSha(
    findBranchPositions(LIUE[yearBranch]),
    '六厄',
    '凶',
    '主災厄連連、困難重重、須謹慎應對'
  );

  // 102. 歲刑（以年支查）
  const suixingTargets = SUIXING[yearBranch];
  if (suixingTargets) {
    const suixingPositions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (suixingTargets.includes(branch) && position !== '年柱') {
        suixingPositions.push(position);
      }
    });
    addShenSha(suixingPositions, '歲刑', '凶', '主刑傷災禍、須防意外、宜謹慎');
  }

  // 103. 牆內桃花（日支為桃花）
  const taohuaBranchDay = TAOHUA[dayBranch];
  if (taohuaBranchDay && QIANGNEII_TAOHUA(dayBranch, taohuaBranchDay)) {
    addShenSha(['日柱'], '牆內桃花', '中', '主配偶貌美、夫妻恩愛、家庭和睦');
  }

  // 104. 牆外桃花（時支為桃花）
  const taohuaBranchYear = TAOHUA[yearBranch];
  if (taohuaBranchYear && QIANGWAI_TAOHUA(hourBranch, taohuaBranchDay || taohuaBranchYear)) {
    addShenSha(['時柱'], '牆外桃花', '中', '主外遇之象、須防感情糾葛');
  }

  // 105. 遍野桃花（月支為桃花）
  if (
    (taohuaBranchDay && BIANYE_TAOHUA(monthBranch, taohuaBranchDay)) ||
    (taohuaBranchYear && BIANYE_TAOHUA(monthBranch, taohuaBranchYear))
  ) {
    addShenSha(['月柱'], '遍野桃花', '中', '主風流成性、桃花氾濫、宜自律');
  }

  // 106. 倒插桃花（年支為桃花）
  if (taohuaBranchDay && DAOCHA_TAOHUA(yearBranch, taohuaBranchDay)) {
    addShenSha(
      ['年柱'],
      '倒插桃花',
      '中',
      '主早年桃花、少年風流、宜注意感情'
    );
  }

  // 107. 沐浴咸池（沐浴與桃花同柱）
  const muyuTarget = MUYU[dayStem];
  if (muyuTarget && (muyuTarget === taohuaBranchDay || muyuTarget === taohuaBranchYear)) {
    const muyuTaohuaPos: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === muyuTarget) {
        muyuTaohuaPos.push(position);
      }
    });
    addShenSha(
      muyuTaohuaPos,
      '沐浴咸池',
      '中',
      '主桃花旺盛、異性緣佳、須防感情糾紛'
    );
  }

  // 108. 裸體桃花（沐浴在日支或時支）
  if (muyuTarget && (dayBranch === muyuTarget || hourBranch === muyuTarget)) {
    const luotiPos: string[] = [];
    if (dayBranch === muyuTarget) luotiPos.push('日柱');
    if (hourBranch === muyuTarget) luotiPos.push('時柱');
    addShenSha(luotiPos, '裸體桃花', '中', '主桃花外露、易招桃色是非');
  }

  // 109. 滾浪桃花（桃花與驛馬同柱）
  const yimaTargetDay = YIMA[dayBranch];
  const yimaTargetYear = YIMA[yearBranch];
  const gunlangPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (
      ((taohuaBranchDay && branch === taohuaBranchDay) ||
        (taohuaBranchYear && branch === taohuaBranchYear)) &&
      (branch === yimaTargetDay || branch === yimaTargetYear)
    ) {
      gunlangPositions.push(position);
    }
  });
  if (gunlangPositions.length > 0) {
    addShenSha(
      gunlangPositions,
      '滾浪桃花',
      '中',
      '主桃花奔波、四處留情、宜自律'
    );
  }

  // 按吉凶排序：吉神在前，中性次之，凶神在後
  const typeOrder = { 吉: 0, 中: 1, 凶: 2 };
  shenShaList.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

  return shenShaList;
}
