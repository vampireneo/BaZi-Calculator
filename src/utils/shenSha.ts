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

  // 1. 天乙貴人（以日干查，看其他柱地支）
  const tianyiTargets = TIANYI_GUIREN[dayStem];
  if (tianyiTargets) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (tianyiTargets.includes(branch)) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '天乙貴人',
        type: '吉',
        description: '逢凶化吉、遇難呈祥，主貴人相助',
        positions,
      });
    }
  }

  // 2. 文昌貴人（以日干查）
  const wenchangTarget = WENCHANG[dayStem];
  if (wenchangTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === wenchangTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '文昌貴人',
        type: '吉',
        description: '主聰明智慧、學業有成、利於考試',
        positions,
      });
    }
  }

  // 3. 桃花（以日支或年支查）
  const taohuaTarget1 = TAOHUA[dayBranch];
  const taohuaTarget2 = TAOHUA[yearBranch];
  const taohuaPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === taohuaTarget1 || branch === taohuaTarget2) {
      if (!taohuaPositions.includes(position)) {
        taohuaPositions.push(position);
      }
    }
  });
  if (taohuaPositions.length > 0) {
    shenShaList.push({
      name: '桃花',
      type: '中',
      description: '主人緣佳、異性緣好，但須防桃色糾紛',
      positions: taohuaPositions,
    });
  }

  // 4. 驛馬（以日支或年支查）
  const yimaTarget1 = YIMA[dayBranch];
  const yimaTarget2 = YIMA[yearBranch];
  const yimaPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === yimaTarget1 || branch === yimaTarget2) {
      if (!yimaPositions.includes(position)) {
        yimaPositions.push(position);
      }
    }
  });
  if (yimaPositions.length > 0) {
    shenShaList.push({
      name: '驛馬',
      type: '中',
      description: '主奔波勞碌、適合外出發展、有遷移變動',
      positions: yimaPositions,
    });
  }

  // 5. 華蓋（以日支或年支查）
  const huagaiTarget1 = HUAGAI[dayBranch];
  const huagaiTarget2 = HUAGAI[yearBranch];
  const huagaiPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === huagaiTarget1 || branch === huagaiTarget2) {
      if (!huagaiPositions.includes(position)) {
        huagaiPositions.push(position);
      }
    }
  });
  if (huagaiPositions.length > 0) {
    shenShaList.push({
      name: '華蓋',
      type: '中',
      description: '主聰明孤傲、適合藝術宗教、喜獨處研究',
      positions: huagaiPositions,
    });
  }

  // 6. 將星（以日支或年支查）
  const jiangxingTarget1 = JIANGXING[dayBranch];
  const jiangxingTarget2 = JIANGXING[yearBranch];
  const jiangxingPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === jiangxingTarget1 || branch === jiangxingTarget2) {
      if (!jiangxingPositions.includes(position)) {
        jiangxingPositions.push(position);
      }
    }
  });
  if (jiangxingPositions.length > 0) {
    shenShaList.push({
      name: '將星',
      type: '吉',
      description: '主領導能力強、有權威、適合管理職位',
      positions: jiangxingPositions,
    });
  }

  // 7. 祿神（以日干查）
  const lushenTarget = LUSHEN[dayStem];
  if (lushenTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === lushenTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '祿神',
        type: '吉',
        description: '主衣食無憂、財祿豐厚、福氣綿長',
        positions,
      });
    }
  }

  // 8. 羊刃（以日干查，陽干才有）
  const yangrenTarget = YANGREN[dayStem];
  if (yangrenTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === yangrenTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '羊刃',
        type: '凶',
        description: '主性格剛烈、易有血光之災、須防意外傷害',
        positions,
      });
    }
  }

  // 9. 天德貴人（以月支查，看四柱天干）
  const tiandeTarget = TIANDE[monthBranch];
  if (tiandeTarget) {
    const positions: string[] = [];
    allStems.forEach(({ stem, position }) => {
      if (stem === tiandeTarget) {
        positions.push(position);
      }
    });
    // 也查地支（部分版本）
    allBranches.forEach(({ branch, position }) => {
      if (branch === tiandeTarget && !positions.includes(position)) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '天德貴人',
        type: '吉',
        description: '主逢凶化吉、一生平安、有貴人扶持',
        positions,
      });
    }
  }

  // 10. 月德貴人（以月支查，看四柱天干）
  const yuedeTarget = YUEDE[monthBranch];
  if (yuedeTarget) {
    const positions: string[] = [];
    allStems.forEach(({ stem, position }) => {
      if (stem === yuedeTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '月德貴人',
        type: '吉',
        description: '主品德高尚、處事平順、有福德庇佑',
        positions,
      });
    }
  }

  // 11. 金輿（以日干查）
  const jinyuTarget = JINYU[dayStem];
  if (jinyuTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === jinyuTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '金輿',
        type: '吉',
        description: '主出行平安、有車馬之福、利於交通',
        positions,
      });
    }
  }

  // 12. 劫煞（以日支或年支查）
  const jieshaTarget1 = JIESHA[dayBranch];
  const jieshaTarget2 = JIESHA[yearBranch];
  const jieshaPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === jieshaTarget1 || branch === jieshaTarget2) {
      if (!jieshaPositions.includes(position)) {
        jieshaPositions.push(position);
      }
    }
  });
  if (jieshaPositions.length > 0) {
    shenShaList.push({
      name: '劫煞',
      type: '凶',
      description: '主易有劫難、須防小人暗害、謹慎理財',
      positions: jieshaPositions,
    });
  }

  // 13. 亡神（以日支或年支查）
  const wangshenTarget1 = WANGSHEN[dayBranch];
  const wangshenTarget2 = WANGSHEN[yearBranch];
  const wangshenPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === wangshenTarget1 || branch === wangshenTarget2) {
      if (!wangshenPositions.includes(position)) {
        wangshenPositions.push(position);
      }
    }
  });
  if (wangshenPositions.length > 0) {
    shenShaList.push({
      name: '亡神',
      type: '凶',
      description: '主心神不寧、易有是非口舌、須防暗耗',
      positions: wangshenPositions,
    });
  }

  // 14. 孤辰（以年支查）
  const guchenTarget = GUCHEN[yearBranch];
  if (guchenTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === guchenTarget && position !== '年柱') {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '孤辰',
        type: '凶',
        description: '主孤獨寂寞、男命克妻、宜晚婚',
        positions,
      });
    }
  }

  // 15. 寡宿（以年支查）
  const guasuTarget = GUASU[yearBranch];
  if (guasuTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === guasuTarget && position !== '年柱') {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '寡宿',
        type: '凶',
        description: '主孤獨寂寞、女命克夫、宜晚婚',
        positions,
      });
    }
  }

  // 16. 天廚貴人（以日干查）
  const tianchuTarget = TIANCHU[dayStem];
  if (tianchuTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === tianchuTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '天廚貴人',
        type: '吉',
        description: '主食祿豐厚、衣食無缺、生活富足',
        positions,
      });
    }
  }

  // 17. 福星貴人（以日干查）
  const fuxingTarget = FUXING[dayStem];
  if (fuxingTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === fuxingTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '福星貴人',
        type: '吉',
        description: '主福氣臨門、一生平安、遇事有救',
        positions,
      });
    }
  }

  // 18. 國印貴人（以日干查）
  const guoyinTarget = GUOYIN[dayStem];
  if (guoyinTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === guoyinTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '國印貴人',
        type: '吉',
        description: '主掌印信權柄、適合公職、有官運',
        positions,
      });
    }
  }

  // 19. 學堂（以日干查）
  const xuetangTarget = XUETANG[dayStem];
  if (xuetangTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === xuetangTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '學堂',
        type: '吉',
        description: '主聰明好學、學業有成、文采出眾',
        positions,
      });
    }
  }

  // 20. 詞館（以日干查）
  const ciguanTarget = CIGUAN[dayStem];
  if (ciguanTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === ciguanTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '詞館',
        type: '吉',
        description: '主文采斐然、能言善辯、利於文職',
        positions,
      });
    }
  }

  // 21. 魁罡（以日柱干支組合查）
  const dayPillarStr = dayStem + dayBranch;
  if (KUIGANG.includes(dayPillarStr)) {
    shenShaList.push({
      name: '魁罡',
      type: '中',
      description: '主性格剛毅、有膽識魄力、但須防剛愎自用',
      positions: ['日柱'],
    });
  }

  // 22. 天羅地網
  const tianluoPositions: string[] = [];
  const diwangPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === TIANLUODIWANG.天羅) {
      tianluoPositions.push(position);
    }
    if (branch === TIANLUODIWANG.地網) {
      diwangPositions.push(position);
    }
  });
  if (tianluoPositions.length > 0 && diwangPositions.length > 0) {
    shenShaList.push({
      name: '天羅地網',
      type: '凶',
      description: '主易遇困阻、諸事不順、須防官非訴訟',
      positions: [...new Set([...tianluoPositions, ...diwangPositions])],
    });
  }

  // 23. 災煞（以日支或年支查）
  const zaishaTarget1 = ZAISHA[dayBranch];
  const zaishaTarget2 = ZAISHA[yearBranch];
  const zaishaPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === zaishaTarget1 || branch === zaishaTarget2) {
      if (!zaishaPositions.includes(position)) {
        zaishaPositions.push(position);
      }
    }
  });
  if (zaishaPositions.length > 0) {
    shenShaList.push({
      name: '災煞',
      type: '凶',
      description: '主災禍臨身、須防水火之災、謹慎行事',
      positions: zaishaPositions,
    });
  }

  // 24. 天煞（以日支或年支查）
  const tianshaTarget1 = TIANSHA[dayBranch];
  const tianshaTarget2 = TIANSHA[yearBranch];
  const tianshaPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === tianshaTarget1 || branch === tianshaTarget2) {
      if (!tianshaPositions.includes(position)) {
        tianshaPositions.push(position);
      }
    }
  });
  if (tianshaPositions.length > 0) {
    shenShaList.push({
      name: '天煞',
      type: '凶',
      description: '主意外災禍、須防飛來橫禍、宜謹慎',
      positions: tianshaPositions,
    });
  }

  // 25. 地煞（以日支或年支查）
  const dishaTarget1 = DISHA[dayBranch];
  const dishaTarget2 = DISHA[yearBranch];
  const dishaPositions: string[] = [];
  allBranches.forEach(({ branch, position }) => {
    if (branch === dishaTarget1 || branch === dishaTarget2) {
      if (!dishaPositions.includes(position)) {
        dishaPositions.push(position);
      }
    }
  });
  if (dishaPositions.length > 0) {
    shenShaList.push({
      name: '地煞',
      type: '凶',
      description: '主地面災害、須防跌傷摔傷、出行謹慎',
      positions: dishaPositions,
    });
  }

  // 26. 紅艷煞（以日干查）
  const hongyanTarget = HONGYAN[dayStem];
  if (hongyanTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === hongyanTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '紅艷煞',
        type: '中',
        description: '主風流多情、異性緣佳、但須防感情糾葛',
        positions,
      });
    }
  }

  // 27. 流霞煞（以日干查）
  const liuxiaTarget = LIUXIA[dayStem];
  if (liuxiaTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === liuxiaTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '流霞煞',
        type: '凶',
        description: '主血光之災、女命須防難產、男命防意外',
        positions,
      });
    }
  }

  // 28. 血刃（以日干查）
  const xuerenTarget = XUEREN[dayStem];
  if (xuerenTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === xuerenTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '血刃',
        type: '凶',
        description: '主血光之災、須防刀傷手術、謹慎行事',
        positions,
      });
    }
  }

  // 29. 天醫（以月支查）
  const tianyiDoctorTarget = TIANYI_DOCTOR[monthBranch];
  if (tianyiDoctorTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === tianyiDoctorTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '天醫',
        type: '吉',
        description: '主適合醫療行業、身體康健、逢病可癒',
        positions,
      });
    }
  }

  // 30. 太極貴人（以日干查）
  const taijiTargets = TAIJI[dayStem];
  if (taijiTargets) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (taijiTargets.includes(branch)) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '太極貴人',
        type: '吉',
        description: '主近貴得福、智慧超群、適合玄學研究',
        positions,
      });
    }
  }

  // 31. 三奇貴人
  const yearStem = yearPillar.heavenlyStem;
  const monthStem = monthPillar.heavenlyStem;
  const hourStem = hourPillar.heavenlyStem;
  const allStemValues = [yearStem, monthStem, dayStem, hourStem];

  // 檢查天上三奇（甲戊庚順序出現）
  const tianSanqiOrder = SANQI.天上三奇;
  let tianSanqiFound = false;
  for (let i = 0; i < allStemValues.length - 2; i++) {
    if (
      allStemValues[i] === tianSanqiOrder[0] &&
      allStemValues[i + 1] === tianSanqiOrder[1] &&
      allStemValues[i + 2] === tianSanqiOrder[2]
    ) {
      tianSanqiFound = true;
      break;
    }
  }
  if (tianSanqiFound) {
    shenShaList.push({
      name: '天上三奇',
      type: '吉',
      description: '主天賦異稟、聰明絕頂、適合研究學問',
      positions: ['年柱', '月柱', '日柱'],
    });
  }

  // 檢查地上三奇（乙丙丁順序出現）
  const diSanqiOrder = SANQI.地上三奇;
  let diSanqiFound = false;
  for (let i = 0; i < allStemValues.length - 2; i++) {
    if (
      allStemValues[i] === diSanqiOrder[0] &&
      allStemValues[i + 1] === diSanqiOrder[1] &&
      allStemValues[i + 2] === diSanqiOrder[2]
    ) {
      diSanqiFound = true;
      break;
    }
  }
  if (diSanqiFound) {
    shenShaList.push({
      name: '地上三奇',
      type: '吉',
      description: '主得地利之便、事業順遂、財運亨通',
      positions: ['年柱', '月柱', '日柱'],
    });
  }

  // 檢查人中三奇（壬癸辛順序出現）
  const renSanqiOrder = SANQI.人中三奇;
  let renSanqiFound = false;
  for (let i = 0; i < allStemValues.length - 2; i++) {
    if (
      allStemValues[i] === renSanqiOrder[0] &&
      allStemValues[i + 1] === renSanqiOrder[1] &&
      allStemValues[i + 2] === renSanqiOrder[2]
    ) {
      renSanqiFound = true;
      break;
    }
  }
  if (renSanqiFound) {
    shenShaList.push({
      name: '人中三奇',
      type: '吉',
      description: '主人緣廣闘、貴人相助、處世圓融',
      positions: ['年柱', '月柱', '日柱'],
    });
  }

  // 32. 天喜（以年支查）
  const tianxiTarget = TIANXI[yearBranch];
  if (tianxiTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === tianxiTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '天喜',
        type: '吉',
        description: '主喜事臨門、婚姻美滿、添丁進財',
        positions,
      });
    }
  }

  // 33. 紅鸞（以年支查）
  const hongluanTarget = HONGLUAN[yearBranch];
  if (hongluanTarget) {
    const positions: string[] = [];
    allBranches.forEach(({ branch, position }) => {
      if (branch === hongluanTarget) {
        positions.push(position);
      }
    });
    if (positions.length > 0) {
      shenShaList.push({
        name: '紅鸞',
        type: '吉',
        description: '主姻緣和合、喜事連連、利於婚嫁',
        positions,
      });
    }
  }

  // 34. 天赦（特定日柱與月支組合）
  for (const rule of TIANSHE) {
    if (
      rule.season.includes(monthBranch) &&
      dayStem === rule.dayStem &&
      dayBranch === rule.dayBranch
    ) {
      shenShaList.push({
        name: '天赦',
        type: '吉',
        description: '主逢凶化吉、罪過可赦、貴人相助',
        positions: ['日柱'],
      });
      break;
    }
  }

  // 35. 陰陽差錯（特定日柱組合）
  if (YINYANG_CHACUO.includes(dayPillarStr)) {
    shenShaList.push({
      name: '陰陽差錯',
      type: '凶',
      description: '主婚姻不順、夫妻易有隔閡、感情多波折',
      positions: ['日柱'],
    });
  }

  // 36. 十惡大敗（特定日柱組合）
  if (SHIE_DABAI.includes(dayPillarStr)) {
    shenShaList.push({
      name: '十惡大敗',
      type: '凶',
      description: '主錢財難聚、事業多阻、須防破敗',
      positions: ['日柱'],
    });
  }

  // 按吉凶排序：吉神在前，中性次之，凶神在後
  const typeOrder = { 吉: 0, 中: 1, 凶: 2 };
  shenShaList.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

  return shenShaList;
}
