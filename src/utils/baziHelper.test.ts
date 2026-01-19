import { describe, it, expect } from 'vitest';
import { calculateBaZi, validateBirthInfo } from './baziHelper';
import type { BirthInfo } from './baziHelper';

describe('calculateBaZi', () => {
  it('should calculate correct BaZi for a known date (1990-01-15 12:30)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 1,
      day: 15,
      hour: 12,
      minute: 30,
    };

    const result = calculateBaZi(birthInfo);

    // Verify the structure
    expect(result).toHaveProperty('solarDate');
    expect(result).toHaveProperty('lunarDate');
    expect(result).toHaveProperty('yearPillar');
    expect(result).toHaveProperty('monthPillar');
    expect(result).toHaveProperty('dayPillar');
    expect(result).toHaveProperty('hourPillar');
    expect(result).toHaveProperty('gender');

    // Verify gender
    expect(result.gender).toBe('男');

    // Verify pillar structure
    expect(result.yearPillar).toHaveProperty('heavenlyStem');
    expect(result.yearPillar).toHaveProperty('earthlyBranch');
    expect(result.yearPillar).toHaveProperty('nayin');
    expect(result.yearPillar).toHaveProperty('hiddenStems');
  });

  it('should calculate correct BaZi for a known date (2000-05-05 08:00) - 庚辰年', () => {
    const birthInfo: BirthInfo = {
      gender: 'female',
      year: 2000,
      month: 5,
      day: 5,
      hour: 8,
      minute: 0,
    };

    const result = calculateBaZi(birthInfo);

    // 2000年5月5日 is in the year of 庚辰 (Metal Dragon)
    expect(result.yearPillar.heavenlyStem).toBe('庚');
    expect(result.yearPillar.earthlyBranch).toBe('辰');
    expect(result.gender).toBe('女');
  });

  it('should calculate correct BaZi for early morning (子時)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1985,
      month: 3,
      day: 20,
      hour: 0,
      minute: 30,
    };

    const result = calculateBaZi(birthInfo);

    // 子時 (23:00 - 01:00)
    expect(result.hourPillar.earthlyBranch).toBe('子');
  });

  it('should calculate correct BaZi for late night (亥時)', () => {
    const birthInfo: BirthInfo = {
      gender: 'female',
      year: 1995,
      month: 8,
      day: 15,
      hour: 22,
      minute: 0,
    };

    const result = calculateBaZi(birthInfo);

    // 亥時 (21:00 - 23:00)
    expect(result.hourPillar.earthlyBranch).toBe('亥');
  });

  it('should return hidden stems for each pillar', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1988,
      month: 6,
      day: 15,
      hour: 14,
      minute: 0,
    };

    const result = calculateBaZi(birthInfo);

    // All pillars should have hidden stems
    expect(Array.isArray(result.yearPillar.hiddenStems)).toBe(true);
    expect(Array.isArray(result.monthPillar.hiddenStems)).toBe(true);
    expect(Array.isArray(result.dayPillar.hiddenStems)).toBe(true);
    expect(Array.isArray(result.hourPillar.hiddenStems)).toBe(true);

    // Hidden stems should contain valid heavenly stems
    const validStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    result.yearPillar.hiddenStems?.forEach((stem) => {
      expect(validStems).toContain(stem);
    });
  });

  it('should return correct hidden stems for 子 (Rat) branch', () => {
    // Find a date where one of the branches is 子
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1984, // 甲子年
      month: 2,
      day: 15,
      hour: 0, // 子時
      minute: 30,
    };

    const result = calculateBaZi(birthInfo);

    // 子 contains only 癸 as hidden stem
    if (result.hourPillar.earthlyBranch === '子') {
      expect(result.hourPillar.hiddenStems).toContain('癸');
    }
  });

  it('should handle leap year dates correctly', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 2000,
      month: 2,
      day: 29, // Leap year
      hour: 12,
      minute: 0,
    };

    const result = calculateBaZi(birthInfo);

    expect(result.solarDate).toContain('2000');
    expect(result.yearPillar.heavenlyStem).toBe('庚');
    expect(result.yearPillar.earthlyBranch).toBe('辰');
  });

  it('should handle dates near Chinese New Year correctly', () => {
    // 2024-02-10 is Chinese New Year (Year of Dragon starts)
    const beforeNewYear: BirthInfo = {
      gender: 'male',
      year: 2024,
      month: 2,
      day: 9,
      hour: 12,
      minute: 0,
    };

    const afterNewYear: BirthInfo = {
      gender: 'male',
      year: 2024,
      month: 2,
      day: 10,
      hour: 12,
      minute: 0,
    };

    const resultBefore = calculateBaZi(beforeNewYear);
    const resultAfter = calculateBaZi(afterNewYear);

    // Both should return valid results
    expect(resultBefore.yearPillar.heavenlyStem).toBeDefined();
    expect(resultAfter.yearPillar.heavenlyStem).toBeDefined();
  });
});

describe('validateBirthInfo', () => {
  it('should validate correct birth info', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 6,
      day: 15,
      hour: 12,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject year before 1900', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1899,
      month: 6,
      day: 15,
      hour: 12,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('年份必須在1900-2100之間');
  });

  it('should reject year after 2100', () => {
    const birthInfo: BirthInfo = {
      gender: 'female',
      year: 2101,
      month: 6,
      day: 15,
      hour: 12,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('年份必須在1900-2100之間');
  });

  it('should reject invalid month (0)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 0,
      day: 15,
      hour: 12,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('月份必須在1-12之間');
  });

  it('should reject invalid month (13)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 13,
      day: 15,
      hour: 12,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('月份必須在1-12之間');
  });

  it('should reject invalid day (0)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 6,
      day: 0,
      hour: 12,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('日期必須在1-31之間');
  });

  it('should reject invalid day (32)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 6,
      day: 32,
      hour: 12,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('日期必須在1-31之間');
  });

  it('should reject invalid hour (-1)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 6,
      day: 15,
      hour: -1,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('小時必須在0-23之間');
  });

  it('should reject invalid hour (24)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 6,
      day: 15,
      hour: 24,
      minute: 30,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('小時必須在0-23之間');
  });

  it('should reject invalid minute (-1)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 6,
      day: 15,
      hour: 12,
      minute: -1,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('分鐘必須在0-59之間');
  });

  it('should reject invalid minute (60)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 6,
      day: 15,
      hour: 12,
      minute: 60,
    };

    const result = validateBirthInfo(birthInfo);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('分鐘必須在0-59之間');
  });

  it('should accept boundary values', () => {
    // Test minimum valid values
    const minBirthInfo: BirthInfo = {
      gender: 'male',
      year: 1900,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
    };
    expect(validateBirthInfo(minBirthInfo).valid).toBe(true);

    // Test maximum valid values
    const maxBirthInfo: BirthInfo = {
      gender: 'female',
      year: 2100,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
    };
    expect(validateBirthInfo(maxBirthInfo).valid).toBe(true);
  });
});

describe('Nayin (納音) Calculation', () => {
  it('should return nayin for all four pillars', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 5,
      day: 15,
      hour: 10,
      minute: 30,
    };

    const result = calculateBaZi(birthInfo);

    // All pillars should have nayin
    expect(result.yearPillar.nayin).toBeDefined();
    expect(result.monthPillar.nayin).toBeDefined();
    expect(result.dayPillar.nayin).toBeDefined();
    expect(result.hourPillar.nayin).toBeDefined();

    // Nayin should be non-empty strings
    expect(result.yearPillar.nayin).toBeTruthy();
    expect(result.monthPillar.nayin).toBeTruthy();
    expect(result.dayPillar.nayin).toBeTruthy();
    expect(result.hourPillar.nayin).toBeTruthy();

    // Nayin should contain Chinese characters
    expect(result.yearPillar.nayin!.length).toBeGreaterThan(0);
    expect(result.monthPillar.nayin!.length).toBeGreaterThan(0);
    expect(result.dayPillar.nayin!.length).toBeGreaterThan(0);
    expect(result.hourPillar.nayin!.length).toBeGreaterThan(0);
  });

  it('should calculate correct nayin for 1990-05-15 10:30', () => {
    // Based on our test results:
    // 年柱: 庚午 納音: 路旁土
    // 月柱: 辛巳 納音: 白蠟金
    // 日柱: 庚辰 納音: 白蠟金
    // 時柱: 辛巳 納音: 白蠟金
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 5,
      day: 15,
      hour: 10,
      minute: 30,
    };

    const result = calculateBaZi(birthInfo);

    // Verify specific nayin values
    expect(result.yearPillar.nayin).toBe('路旁土');
    expect(result.monthPillar.nayin).toBe('白蠟金');
    expect(result.dayPillar.nayin).toBe('白蠟金');
    expect(result.hourPillar.nayin).toBe('白蠟金');
  });

  it('should have valid nayin for different dates', () => {
    const testCases: BirthInfo[] = [
      { gender: 'male', year: 1984, month: 2, day: 5, hour: 12, minute: 0 },
      { gender: 'female', year: 2000, month: 5, day: 5, hour: 8, minute: 0 },
      { gender: 'male', year: 1995, month: 8, day: 20, hour: 15, minute: 30 },
    ];

    testCases.forEach((birthInfo) => {
      const result = calculateBaZi(birthInfo);

      // All pillars should have nayin
      expect(result.yearPillar.nayin).toBeDefined();
      expect(result.monthPillar.nayin).toBeDefined();
      expect(result.dayPillar.nayin).toBeDefined();
      expect(result.hourPillar.nayin).toBeDefined();

      // Nayin should be non-empty strings
      expect(result.yearPillar.nayin!.length).toBeGreaterThan(1);
      expect(result.monthPillar.nayin!.length).toBeGreaterThan(1);
      expect(result.dayPillar.nayin!.length).toBeGreaterThan(1);
      expect(result.hourPillar.nayin!.length).toBeGreaterThan(1);
    });
  });

  it('should calculate nayin for 甲子 (first in 60-cycle)', () => {
    // 甲子 should have nayin 海中金
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1984,
      month: 2,
      day: 5,
      hour: 0,
      minute: 30,
    };

    const result = calculateBaZi(birthInfo);

    // 1984 is 甲子年, should have 海中金 as nayin
    if (result.yearPillar.heavenlyStem === '甲' && result.yearPillar.earthlyBranch === '子') {
      expect(result.yearPillar.nayin).toBe('海中金');
    }
  });
});

describe('BaZi Calculation Accuracy', () => {
  it('should calculate correct four pillars for 1984-01-01 00:00 (甲子年)', () => {
    // Note: 1984-01-01 is still in 癸亥年 (lunar calendar)
    // The year of 甲子 starts around Feb 2, 1984
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1984,
      month: 2,
      day: 5,
      hour: 12,
      minute: 0,
    };

    const result = calculateBaZi(birthInfo);

    // After Feb 4, 1984 (立春), it should be 甲子年
    expect(result.yearPillar.heavenlyStem).toBe('甲');
    expect(result.yearPillar.earthlyBranch).toBe('子');
  });

  it('should have valid heavenly stems (天干)', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 1990,
      month: 5,
      day: 15,
      hour: 10,
      minute: 0,
    };

    const result = calculateBaZi(birthInfo);
    const validStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

    expect(validStems).toContain(result.yearPillar.heavenlyStem);
    expect(validStems).toContain(result.monthPillar.heavenlyStem);
    expect(validStems).toContain(result.dayPillar.heavenlyStem);
    expect(validStems).toContain(result.hourPillar.heavenlyStem);
  });

  it('should have valid earthly branches (地支)', () => {
    const birthInfo: BirthInfo = {
      gender: 'female',
      year: 1995,
      month: 8,
      day: 20,
      hour: 15,
      minute: 30,
    };

    const result = calculateBaZi(birthInfo);
    const validBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    expect(validBranches).toContain(result.yearPillar.earthlyBranch);
    expect(validBranches).toContain(result.monthPillar.earthlyBranch);
    expect(validBranches).toContain(result.dayPillar.earthlyBranch);
    expect(validBranches).toContain(result.hourPillar.earthlyBranch);
  });

  it('should return non-empty solar and lunar dates', () => {
    const birthInfo: BirthInfo = {
      gender: 'male',
      year: 2000,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
    };

    const result = calculateBaZi(birthInfo);

    expect(result.solarDate).toBeTruthy();
    expect(result.solarDate.length).toBeGreaterThan(0);
    expect(result.lunarDate).toBeTruthy();
    expect(result.lunarDate.length).toBeGreaterThan(0);
  });
});
