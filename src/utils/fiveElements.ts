/**
 * 五行計算工具
 * 用於計算八字中的五行分佈
 */

// 五行類型
export type FiveElement = '金' | '木' | '水' | '火' | '土';

// 五行統計結果
export interface FiveElementsCount {
  金: number;
  木: number;
  水: number;
  火: number;
  土: number;
}

// 天干對應五行
const HEAVENLY_STEM_ELEMENTS: Record<string, FiveElement> = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
};

// 地支對應五行
const EARTHLY_BRANCH_ELEMENTS: Record<string, FiveElement> = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水',
};

/**
 * 獲取天干的五行屬性
 * @param stem 天干
 * @returns 五行屬性
 */
export function getHeavenlyStemElement(stem: string): FiveElement | null {
  return HEAVENLY_STEM_ELEMENTS[stem] || null;
}

/**
 * 獲取地支的五行屬性
 * @param branch 地支
 * @returns 五行屬性
 */
export function getEarthlyBranchElement(branch: string): FiveElement | null {
  return EARTHLY_BRANCH_ELEMENTS[branch] || null;
}

/**
 * 初始化五行計數器
 * @returns 五行計數對象
 */
function initFiveElementsCount(): FiveElementsCount {
  return {
    金: 0,
    木: 0,
    水: 0,
    火: 0,
    土: 0,
  };
}

/**
 * 計算八字中的五行分佈
 * @param pillars 四柱數組 [年柱, 月柱, 日柱, 時柱]
 * @returns 五行統計結果
 */
export function calculateFiveElements(
  pillars: Array<{ heavenlyStem: string; earthlyBranch: string }>
): FiveElementsCount {
  const count = initFiveElementsCount();

  pillars.forEach((pillar) => {
    // 統計天干五行
    const stemElement = getHeavenlyStemElement(pillar.heavenlyStem);
    if (stemElement) {
      count[stemElement]++;
    }

    // 統計地支五行
    const branchElement = getEarthlyBranchElement(pillar.earthlyBranch);
    if (branchElement) {
      count[branchElement]++;
    }
  });

  return count;
}

/**
 * 獲取五行強弱描述
 * @param count 五行數量
 * @returns 強弱描述
 */
export function getFiveElementStrength(count: number): string {
  if (count === 0) return '缺';
  if (count === 1) return '弱';
  if (count === 2) return '平';
  if (count === 3) return '旺';
  return '極旺';
}

/**
 * 獲取缺失的五行
 * @param elementsCount 五行統計
 * @returns 缺失的五行數組
 */
export function getMissingElements(elementsCount: FiveElementsCount): FiveElement[] {
  const missing: FiveElement[] = [];
  (Object.keys(elementsCount) as FiveElement[]).forEach((element) => {
    if (elementsCount[element] === 0) {
      missing.push(element);
    }
  });
  return missing;
}

/**
 * 獲取最旺的五行
 * @param elementsCount 五行統計
 * @returns 最旺的五行數組（可能多個並列）
 */
export function getStrongestElements(elementsCount: FiveElementsCount): FiveElement[] {
  const maxCount = Math.max(...Object.values(elementsCount));
  const strongest: FiveElement[] = [];
  (Object.keys(elementsCount) as FiveElement[]).forEach((element) => {
    if (elementsCount[element] === maxCount) {
      strongest.push(element);
    }
  });
  return strongest;
}

/**
 * 日主資訊
 */
export interface DayMasterInfo {
  stem: string; // 天干，如 "己"
  element: FiveElement; // 五行，如 "土"
  displayName: string; // 顯示名稱，如 "己土"
}

/**
 * 五行生克關係
 * 生：木→火→土→金→水→木
 * 克：木→土→水→火→金→木
 */
const ELEMENT_GENERATES: Record<FiveElement, FiveElement> = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木',
};

const ELEMENT_GENERATED_BY: Record<FiveElement, FiveElement> = {
  木: '水',
  火: '木',
  土: '火',
  金: '土',
  水: '金',
};

const ELEMENT_CONTROLS: Record<FiveElement, FiveElement> = {
  木: '土',
  土: '水',
  水: '火',
  火: '金',
  金: '木',
};

const ELEMENT_CONTROLLED_BY: Record<FiveElement, FiveElement> = {
  木: '金',
  土: '木',
  水: '土',
  火: '水',
  金: '火',
};

/**
 * 獲取日主資訊
 * @param dayHeavenlyStem 日柱天干
 * @returns 日主資訊
 */
export function getDayMasterInfo(dayHeavenlyStem: string): DayMasterInfo | null {
  const element = getHeavenlyStemElement(dayHeavenlyStem);
  if (!element) return null;

  return {
    stem: dayHeavenlyStem,
    element,
    displayName: `${dayHeavenlyStem}${element}`,
  };
}

/**
 * 日主強弱結果
 */
export interface DayMasterStrength {
  isStrong: boolean; // 日主是否偏強
  sameTypeCount: number; // 同類五行數量（生我、比我）
  differentTypeCount: number; // 異類五行數量（我生、克我、我克）
  strengthLabel: string; // 強弱描述
}

/**
 * 計算日主強弱
 * 同類：生我者（印）+ 比我者（比劫）
 * 異類：我生者（食傷）+ 克我者（官殺）+ 我克者（財）
 *
 * @param dayMasterElement 日主五行
 * @param fiveElements 八字五行分佈
 * @returns 日主強弱結果
 */
export function calculateDayMasterStrength(
  dayMasterElement: FiveElement,
  fiveElements: FiveElementsCount
): DayMasterStrength {
  // 同類：生我者 + 比我者
  const generatesMe = ELEMENT_GENERATED_BY[dayMasterElement]; // 印（生我）
  const sameAsMe = dayMasterElement; // 比（比我）

  // 異類：我生者 + 克我者 + 我克者
  const iGenerate = ELEMENT_GENERATES[dayMasterElement]; // 食傷（我生）
  const controlsMe = ELEMENT_CONTROLLED_BY[dayMasterElement]; // 官殺（克我）
  const iControl = ELEMENT_CONTROLS[dayMasterElement]; // 財（我克）

  const sameTypeCount = fiveElements[generatesMe] + fiveElements[sameAsMe];
  const differentTypeCount =
    fiveElements[iGenerate] + fiveElements[controlsMe] + fiveElements[iControl];

  const isStrong = sameTypeCount >= differentTypeCount;

  let strengthLabel: string;
  const diff = sameTypeCount - differentTypeCount;
  if (diff >= 3) {
    strengthLabel = '極強';
  } else if (diff >= 1) {
    strengthLabel = '偏強';
  } else if (diff >= -1) {
    strengthLabel = '中和';
  } else if (diff >= -3) {
    strengthLabel = '偏弱';
  } else {
    strengthLabel = '極弱';
  }

  return {
    isStrong,
    sameTypeCount,
    differentTypeCount,
    strengthLabel,
  };
}

/**
 * 喜忌神結果
 */
export interface FavorableElements {
  favorable: FiveElement[]; // 喜神（對日主有利的五行）
  unfavorable: FiveElement[]; // 忌神（對日主不利的五行）
  explanation: string; // 解釋說明
}

/**
 * 十神類型
 */
export type TenGod =
  | '比肩'  // 同五行同陰陽
  | '劫財'  // 同五行異陰陽
  | '食神'  // 我生，同陰陽
  | '傷官'  // 我生，異陰陽
  | '偏財'  // 我克，同陰陽
  | '正財'  // 我克，異陰陽
  | '七殺'  // 克我，同陰陽
  | '正官'  // 克我，異陰陽
  | '偏印'  // 生我，同陰陽
  | '正印'; // 生我，異陰陽

/**
 * 四柱十神結果
 */
export interface PillarTenGods {
  year: TenGod | null;   // 年柱天干的十神
  month: TenGod | null;  // 月柱天干的十神
  day: null;             // 日柱天干為日主，無十神
  hour: TenGod | null;   // 時柱天干的十神
}

/**
 * 天干陰陽屬性
 * 陽：甲、丙、戊、庚、壬
 * 陰：乙、丁、己、辛、癸
 */
const HEAVENLY_STEM_POLARITY: Record<string, 'yang' | 'yin'> = {
  甲: 'yang',
  乙: 'yin',
  丙: 'yang',
  丁: 'yin',
  戊: 'yang',
  己: 'yin',
  庚: 'yang',
  辛: 'yin',
  壬: 'yang',
  癸: 'yin',
};

/**
 * 判斷兩個天干的陰陽是否相同
 * @param stem1 天干1
 * @param stem2 天干2
 * @returns 是否同陰陽
 */
function isSamePolarity(stem1: string, stem2: string): boolean {
  return HEAVENLY_STEM_POLARITY[stem1] === HEAVENLY_STEM_POLARITY[stem2];
}

/**
 * 計算天干相對於日主的十神
 * @param stem 要判斷的天干
 * @param dayMasterStem 日主天干
 * @returns 十神類型
 */
export function calculateTenGod(stem: string, dayMasterStem: string): TenGod | null {
  const stemElement = getHeavenlyStemElement(stem);
  const dayMasterElement = getHeavenlyStemElement(dayMasterStem);

  if (!stemElement || !dayMasterElement) {
    return null;
  }

  const samePolarity = isSamePolarity(stem, dayMasterStem);

  // 同五行：比肩、劫財
  if (stemElement === dayMasterElement) {
    return samePolarity ? '比肩' : '劫財';
  }

  // 我生：食神、傷官
  if (ELEMENT_GENERATES[dayMasterElement] === stemElement) {
    return samePolarity ? '食神' : '傷官';
  }

  // 我克：偏財、正財
  if (ELEMENT_CONTROLS[dayMasterElement] === stemElement) {
    return samePolarity ? '偏財' : '正財';
  }

  // 克我：七殺、正官
  if (ELEMENT_CONTROLLED_BY[dayMasterElement] === stemElement) {
    return samePolarity ? '七殺' : '正官';
  }

  // 生我：偏印、正印
  if (ELEMENT_GENERATED_BY[dayMasterElement] === stemElement) {
    return samePolarity ? '偏印' : '正印';
  }

  return null;
}

/**
 * 計算四柱天干的十神
 * @param pillars 四柱數組 [年柱, 月柱, 日柱, 時柱]
 * @returns 四柱十神結果
 */
export function calculatePillarTenGods(
  pillars: Array<{ heavenlyStem: string }>
): PillarTenGods {
  const dayMasterStem = pillars[2].heavenlyStem; // 日柱天干為日主

  return {
    year: calculateTenGod(pillars[0].heavenlyStem, dayMasterStem),
    month: calculateTenGod(pillars[1].heavenlyStem, dayMasterStem),
    day: null, // 日主本身無十神
    hour: calculateTenGod(pillars[3].heavenlyStem, dayMasterStem),
  };
}

/**
 * 計算喜神和忌神
 * 日主強：喜洩耗（我生、克我、我克），忌生扶（生我、比我）
 * 日主弱：喜生扶（生我、比我），忌洩耗（我生、克我、我克）
 *
 * @param dayMasterElement 日主五行
 * @param strength 日主強弱
 * @returns 喜忌神結果
 */
export function calculateFavorableElements(
  dayMasterElement: FiveElement,
  strength: DayMasterStrength
): FavorableElements {
  // 生我者 + 比我者（扶助日主）
  const supportElements: FiveElement[] = [
    ELEMENT_GENERATED_BY[dayMasterElement], // 印（生我）
    dayMasterElement, // 比（比我）
  ];

  // 我生者 + 克我者 + 我克者（洩耗日主）
  const drainElements: FiveElement[] = [
    ELEMENT_GENERATES[dayMasterElement], // 食傷（我生）
    ELEMENT_CONTROLLED_BY[dayMasterElement], // 官殺（克我）
    ELEMENT_CONTROLS[dayMasterElement], // 財（我克）
  ];

  if (strength.isStrong) {
    return {
      favorable: drainElements,
      unfavorable: supportElements,
      explanation: `日主${strength.strengthLabel}，喜洩耗，忌生扶`,
    };
  } else {
    return {
      favorable: supportElements,
      unfavorable: drainElements,
      explanation: `日主${strength.strengthLabel}，喜生扶，忌洩耗`,
    };
  }
}
