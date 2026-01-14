import { describe, it, expect } from 'vitest';
import {
  getHeavenlyStemElement,
  getEarthlyBranchElement,
  calculateFiveElements,
  getFiveElementStrength,
  getMissingElements,
  getStrongestElements,
} from './fiveElements';

describe('五行計算測試', () => {
  describe('getHeavenlyStemElement', () => {
    it('應該正確返回天干對應的五行', () => {
      expect(getHeavenlyStemElement('甲')).toBe('木');
      expect(getHeavenlyStemElement('乙')).toBe('木');
      expect(getHeavenlyStemElement('丙')).toBe('火');
      expect(getHeavenlyStemElement('丁')).toBe('火');
      expect(getHeavenlyStemElement('戊')).toBe('土');
      expect(getHeavenlyStemElement('己')).toBe('土');
      expect(getHeavenlyStemElement('庚')).toBe('金');
      expect(getHeavenlyStemElement('辛')).toBe('金');
      expect(getHeavenlyStemElement('壬')).toBe('水');
      expect(getHeavenlyStemElement('癸')).toBe('水');
    });

    it('對於無效輸入應該返回 null', () => {
      expect(getHeavenlyStemElement('無效')).toBe(null);
    });
  });

  describe('getEarthlyBranchElement', () => {
    it('應該正確返回地支對應的五行', () => {
      expect(getEarthlyBranchElement('子')).toBe('水');
      expect(getEarthlyBranchElement('丑')).toBe('土');
      expect(getEarthlyBranchElement('寅')).toBe('木');
      expect(getEarthlyBranchElement('卯')).toBe('木');
      expect(getEarthlyBranchElement('辰')).toBe('土');
      expect(getEarthlyBranchElement('巳')).toBe('火');
      expect(getEarthlyBranchElement('午')).toBe('火');
      expect(getEarthlyBranchElement('未')).toBe('土');
      expect(getEarthlyBranchElement('申')).toBe('金');
      expect(getEarthlyBranchElement('酉')).toBe('金');
      expect(getEarthlyBranchElement('戌')).toBe('土');
      expect(getEarthlyBranchElement('亥')).toBe('水');
    });

    it('對於無效輸入應該返回 null', () => {
      expect(getEarthlyBranchElement('無效')).toBe(null);
    });
  });

  describe('calculateFiveElements', () => {
    it('應該正確計算四柱的五行分佈', () => {
      // 測試案例：甲子、乙丑、丙寅、丁卯
      // 甲(木) 子(水) = 1木 1水
      // 乙(木) 丑(土) = 1木 1土
      // 丙(火) 寅(木) = 1火 1木
      // 丁(火) 卯(木) = 1火 1木
      // 總計：木4、火2、土1、金0、水1
      const pillars = [
        { heavenlyStem: '甲', earthlyBranch: '子' },
        { heavenlyStem: '乙', earthlyBranch: '丑' },
        { heavenlyStem: '丙', earthlyBranch: '寅' },
        { heavenlyStem: '丁', earthlyBranch: '卯' },
      ];

      const result = calculateFiveElements(pillars);

      expect(result).toEqual({
        金: 0,
        木: 4,
        水: 1,
        火: 2,
        土: 1,
      });
    });

    it('應該正確計算五行俱全的八字', () => {
      // 庚(金) 申(金) = 2金
      // 甲(木) 寅(木) = 2木
      // 壬(水) 午(火) = 1水 1火 （需要火）
      // 戊(土) 辰(土) = 2土
      const pillars = [
        { heavenlyStem: '庚', earthlyBranch: '申' },
        { heavenlyStem: '甲', earthlyBranch: '寅' },
        { heavenlyStem: '壬', earthlyBranch: '午' },
        { heavenlyStem: '戊', earthlyBranch: '辰' },
      ];

      const result = calculateFiveElements(pillars);

      expect(result.金).toBeGreaterThan(0);
      expect(result.木).toBeGreaterThan(0);
      expect(result.水).toBeGreaterThan(0);
      expect(result.火).toBeGreaterThan(0);
      expect(result.土).toBeGreaterThan(0);
    });
  });

  describe('getFiveElementStrength', () => {
    it('應該返回正確的強弱描述', () => {
      expect(getFiveElementStrength(0)).toBe('缺');
      expect(getFiveElementStrength(1)).toBe('弱');
      expect(getFiveElementStrength(2)).toBe('平');
      expect(getFiveElementStrength(3)).toBe('旺');
      expect(getFiveElementStrength(4)).toBe('極旺');
      expect(getFiveElementStrength(5)).toBe('極旺');
    });
  });

  describe('getMissingElements', () => {
    it('應該正確識別缺失的五行', () => {
      const elementsCount = {
        金: 0,
        木: 2,
        水: 1,
        火: 3,
        土: 0,
      };

      const missing = getMissingElements(elementsCount);
      expect(missing).toContain('金');
      expect(missing).toContain('土');
      expect(missing).toHaveLength(2);
    });

    it('五行俱全時應該返回空數組', () => {
      const elementsCount = {
        金: 1,
        木: 2,
        水: 1,
        火: 3,
        土: 1,
      };

      const missing = getMissingElements(elementsCount);
      expect(missing).toHaveLength(0);
    });
  });

  describe('getStrongestElements', () => {
    it('應該返回最旺的五行', () => {
      const elementsCount = {
        金: 1,
        木: 4,
        水: 1,
        火: 2,
        土: 0,
      };

      const strongest = getStrongestElements(elementsCount);
      expect(strongest).toContain('木');
      expect(strongest).toHaveLength(1);
    });

    it('應該處理多個並列最旺的情況', () => {
      const elementsCount = {
        金: 2,
        木: 2,
        水: 1,
        火: 2,
        土: 1,
      };

      const strongest = getStrongestElements(elementsCount);
      expect(strongest).toContain('金');
      expect(strongest).toContain('木');
      expect(strongest).toContain('火');
      expect(strongest).toHaveLength(3);
    });
  });
});
