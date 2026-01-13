import { describe, it, expect } from 'vitest';
import { calculateTrueSolarTime, formatCorrectionInfo } from './trueSolarTime';
import { calculateEquationOfTime } from './equationOfTime';
import { getCityByKey } from './cities';

describe('均時差計算 (Equation of Time)', () => {
  it('2月中旬的均時差應該約為 -14 分鐘', () => {
    const eot = calculateEquationOfTime(2000, 2, 10);
    // 2月中旬是均時差最小值的時期，約 -14 分鐘
    expect(eot).toBeGreaterThan(-15);
    expect(eot).toBeLessThan(-13);
  });

  it('11月初的均時差應該約為 +16 分鐘', () => {
    const eot = calculateEquationOfTime(2024, 11, 3);
    // 11月初是均時差最大值的時期，約 +16 分鐘
    expect(eot).toBeGreaterThan(15);
    expect(eot).toBeLessThan(17);
  });

  it('4月中旬的均時差應該接近 0', () => {
    const eot = calculateEquationOfTime(2024, 4, 15);
    // 4月中旬均時差接近 0
    expect(Math.abs(eot)).toBeLessThan(2);
  });
});

describe('真太陽時計算', () => {
  it('2月中旬香港時間 - 應計算正確的真太陽時（傳統方法）', () => {
    const city = getCityByKey('HKG')!;
    const result = calculateTrueSolarTime(2000, 2, 10, 14, 30, city);

    // 驗證均時差約為 -14 分鐘
    expect(result.equationOfTimeMinutes).toBeGreaterThan(-15);
    expect(result.equationOfTimeMinutes).toBeLessThan(-13);

    // 驗證經度校正（香港 114.17°E * 4 = 456.68 分鐘）
    // 注意：傳統方法不使用經度校正，但仍計算此值供參考
    expect(result.longitudeOffsetMinutes).toBeCloseTo(114.17 * 4, 1);

    // 傳統方法：真太陽時 = 本地時間 + 均時差
    // 2000-02-10 14:30 + (-14分左右) = 約 14:16
    expect(result.hour).toBe(14);
    expect(result.minute).toBeGreaterThan(14);
    expect(result.minute).toBeLessThan(17);
  });

  it('台北時間計算 - 驗證傳統方法', () => {
    const city = getCityByKey('TPE')!;
    const result = calculateTrueSolarTime(2024, 2, 10, 12, 0, city);

    // 驗證均時差
    expect(result.equationOfTimeMinutes).toBeGreaterThan(-15);
    expect(result.equationOfTimeMinutes).toBeLessThan(-13);

    // 驗證經度校正值（台北 121.56°E * 4 = 486.24 分鐘）
    // 注意：傳統方法不使用經度校正，但仍計算此值供參考
    expect(result.longitudeOffsetMinutes).toBeCloseTo(121.56 * 4, 1);

    // 驗證結果包含所有必要欄位
    expect(result.year).toBeDefined();
    expect(result.month).toBeDefined();
    expect(result.day).toBeDefined();
    expect(result.hour).toBeDefined();
    expect(result.minute).toBeDefined();
    expect(result.trueSolarTime).toBeDefined();
    expect(result.meanSolarTime).toBeDefined();
  });

  it('格式化校正資訊應包含均時差', () => {
    const city = getCityByKey('HKG')!;
    const result = calculateTrueSolarTime(2000, 2, 10, 14, 30, city);
    const info = formatCorrectionInfo(result);

    // 應該包含 DST、經度和均時差資訊
    expect(info).toContain('DST');
    expect(info).toContain('經度');
    expect(info).toContain('均時差');
  });
});
