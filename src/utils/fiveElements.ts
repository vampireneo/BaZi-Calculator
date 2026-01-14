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
