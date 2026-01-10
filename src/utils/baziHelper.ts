import { Solar } from 'lunar-javascript';

export interface BirthInfo {
  gender: 'male' | 'female';
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
  hiddenStems?: string[];
}

export interface BaZiResult {
  solarDate: string;
  lunarDate: string;
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  gender: string;
}

/**
 * 计算八字排盘
 * @param birthInfo 出生信息
 * @returns 八字结果
 */
export function calculateBaZi(birthInfo: BirthInfo): BaZiResult {
  const { year, month, day, hour, minute, gender } = birthInfo;

  // 使用 Solar 创建公历日期对象
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);

  // 转换为农历对象
  const lunar = solar.getLunar();

  // 获取八字对象
  const eightChar = lunar.getEightChar();

  // 获取四柱
  const yearPillar: Pillar = {
    heavenlyStem: eightChar.getYearGan(),
    earthlyBranch: eightChar.getYearZhi(),
    hiddenStems: getHiddenStems(eightChar.getYearZhi()),
  };

  const monthPillar: Pillar = {
    heavenlyStem: eightChar.getMonthGan(),
    earthlyBranch: eightChar.getMonthZhi(),
    hiddenStems: getHiddenStems(eightChar.getMonthZhi()),
  };

  const dayPillar: Pillar = {
    heavenlyStem: eightChar.getDayGan(),
    earthlyBranch: eightChar.getDayZhi(),
    hiddenStems: getHiddenStems(eightChar.getDayZhi()),
  };

  const hourPillar: Pillar = {
    heavenlyStem: eightChar.getTimeGan(),
    earthlyBranch: eightChar.getTimeZhi(),
    hiddenStems: getHiddenStems(eightChar.getTimeZhi()),
  };

  return {
    solarDate: solar.toYmd(),
    lunarDate: `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    gender: gender === 'male' ? '男' : '女',
  };
}

/**
 * 获取地支藏干
 * @param earthlyBranch 地支
 * @returns 藏干数组
 */
function getHiddenStems(earthlyBranch: string): string[] {
  const hiddenStemsMap: Record<string, string[]> = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲'],
  };

  return hiddenStemsMap[earthlyBranch] || [];
}

/**
 * 验证日期输入
 * @param birthInfo 出生信息
 * @returns 是否有效
 */
export function validateBirthInfo(birthInfo: BirthInfo): { valid: boolean; error?: string } {
  const { year, month, day, hour, minute } = birthInfo;

  if (year < 1900 || year > 2100) {
    return { valid: false, error: '年份必须在1900-2100之间' };
  }

  if (month < 1 || month > 12) {
    return { valid: false, error: '月份必须在1-12之间' };
  }

  if (day < 1 || day > 31) {
    return { valid: false, error: '日期必须在1-31之间' };
  }

  if (hour < 0 || hour > 23) {
    return { valid: false, error: '小时必须在0-23之间' };
  }

  if (minute < 0 || minute > 59) {
    return { valid: false, error: '分钟必须在0-59之间' };
  }

  return { valid: true };
}
