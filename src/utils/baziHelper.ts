import { SolarTime, EarthBranch } from 'tyme4ts';
import { calculateTrueSolarTime, formatCorrectionInfo, formatCorrectedTime } from './trueSolarTime';
import type { City } from './cities';
import { getDefaultCity } from './cities';

export interface BirthInfo {
  gender: 'male' | 'female';
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city?: City; // 可選的城市資料，用於真太陽時計算
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
  // 真太陽時校正資訊
  correctionInfo?: {
    cityName: string;
    isDST: boolean;
    dstOffsetMinutes: number;
    longitudeOffsetMinutes: number;
    correctedTime: string;
    correctionSummary: string;
  };
}

/**
 * 計算八字排盤
 * @param birthInfo 出生資訊
 * @returns 八字結果
 */
export function calculateBaZi(birthInfo: BirthInfo): BaZiResult {
  const { year, month, day, hour, minute, gender, city } = birthInfo;

  // 獲取城市資料，若無則使用預設城市（台北）
  const selectedCity = city || getDefaultCity();

  // 計算真太陽時（地方平太陽時）
  const trueSolarTimeResult = calculateTrueSolarTime(
    year, month, day, hour, minute, selectedCity
  );

  // 使用校正後的真太陽時創建 SolarTime 對象
  const solarTime = SolarTime.fromYmdHms(
    trueSolarTimeResult.year,
    trueSolarTimeResult.month,
    trueSolarTimeResult.day,
    trueSolarTimeResult.hour,
    trueSolarTimeResult.minute,
    trueSolarTimeResult.second
  );

  // 獲取農曆日期
  const lunarDay = solarTime.getSolarDay().getLunarDay();

  // 獲取八字對象
  const eightChar = solarTime.getSixtyCycleHour().getEightChar();

  // 獲取四柱
  const yearSixtyCycle = eightChar.getYear();
  const monthSixtyCycle = eightChar.getMonth();
  const daySixtyCycle = eightChar.getDay();
  const hourSixtyCycle = eightChar.getHour();

  const yearPillar: Pillar = {
    heavenlyStem: yearSixtyCycle.getHeavenStem().getName(),
    earthlyBranch: yearSixtyCycle.getEarthBranch().getName(),
    hiddenStems: getHiddenStems(yearSixtyCycle.getEarthBranch()),
  };

  const monthPillar: Pillar = {
    heavenlyStem: monthSixtyCycle.getHeavenStem().getName(),
    earthlyBranch: monthSixtyCycle.getEarthBranch().getName(),
    hiddenStems: getHiddenStems(monthSixtyCycle.getEarthBranch()),
  };

  const dayPillar: Pillar = {
    heavenlyStem: daySixtyCycle.getHeavenStem().getName(),
    earthlyBranch: daySixtyCycle.getEarthBranch().getName(),
    hiddenStems: getHiddenStems(daySixtyCycle.getEarthBranch()),
  };

  const hourPillar: Pillar = {
    heavenlyStem: hourSixtyCycle.getHeavenStem().getName(),
    earthlyBranch: hourSixtyCycle.getEarthBranch().getName(),
    hiddenStems: getHiddenStems(hourSixtyCycle.getEarthBranch()),
  };

  return {
    solarDate: solarTime.getSolarDay().toString(),
    lunarDate: lunarDay.toString(),
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    gender: gender === 'male' ? '男' : '女',
    correctionInfo: {
      cityName: selectedCity.name,
      isDST: trueSolarTimeResult.isDST,
      dstOffsetMinutes: trueSolarTimeResult.dstOffsetMinutes,
      longitudeOffsetMinutes: trueSolarTimeResult.longitudeOffsetMinutes,
      correctedTime: formatCorrectedTime(trueSolarTimeResult),
      correctionSummary: formatCorrectionInfo(trueSolarTimeResult),
    },
  };
}

/**
 * 獲取地支藏干
 * @param earthlyBranch 地支對象
 * @returns 藏干數組
 */
function getHiddenStems(earthlyBranch: EarthBranch): string[] {
  // 使用 tyme4ts 提供的藏干功能
  const hideHeavenStems = earthlyBranch.getHideHeavenStems();
  return hideHeavenStems.map(hideHeavenStem => hideHeavenStem.getHeavenStem().getName());
}

/**
 * 驗證日期輸入
 * @param birthInfo 出生資訊
 * @returns 是否有效
 */
export function validateBirthInfo(birthInfo: BirthInfo): { valid: boolean; error?: string } {
  const { year, month, day, hour, minute } = birthInfo;

  if (year < 1900 || year > 2100) {
    return { valid: false, error: '年份必須在1900-2100之間' };
  }

  if (month < 1 || month > 12) {
    return { valid: false, error: '月份必須在1-12之間' };
  }

  if (day < 1 || day > 31) {
    return { valid: false, error: '日期必須在1-31之間' };
  }

  if (hour < 0 || hour > 23) {
    return { valid: false, error: '小時必須在0-23之間' };
  }

  if (minute < 0 || minute > 59) {
    return { valid: false, error: '分鐘必須在0-59之間' };
  }

  return { valid: true };
}
