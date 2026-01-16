import { describe, it, expect } from 'vitest';
import { calculateBaZiShenSha, type BaZiShenSha } from './shenSha';
import type { Pillar } from './baziHelper';

// 輔助函數：創建測試用四柱
const createPillars = (
  year: { stem: string; branch: string },
  month: { stem: string; branch: string },
  day: { stem: string; branch: string },
  hour: { stem: string; branch: string }
): { year: Pillar; month: Pillar; day: Pillar; hour: Pillar } => ({
  year: { heavenlyStem: year.stem, earthlyBranch: year.branch },
  month: { heavenlyStem: month.stem, earthlyBranch: month.branch },
  day: { heavenlyStem: day.stem, earthlyBranch: day.branch },
  hour: { heavenlyStem: hour.stem, earthlyBranch: hour.branch },
});

// 輔助函數：查找特定神煞
const findShenSha = (
  list: BaZiShenSha[],
  name: string
): BaZiShenSha | undefined => list.find((s) => s.name === name);

describe('八字神煞計算測試', () => {
  describe('天乙貴人', () => {
    it('日干甲應在丑或未支找到天乙貴人', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '丑' }, // 年支丑
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '辰' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianyi = findShenSha(result, '天乙貴人');
      expect(tianyi).toBeDefined();
      expect(tianyi?.type).toBe('吉');
      expect(tianyi?.positions).toContain('年柱');
    });

    it('日干辛應在午或寅支找到天乙貴人', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '午' }, // 年支午
        { stem: '丙', branch: '寅' }, // 月支寅
        { stem: '辛', branch: '辰' }, // 日干辛
        { stem: '庚', branch: '子' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianyi = findShenSha(result, '天乙貴人');
      expect(tianyi).toBeDefined();
      expect(tianyi?.positions).toContain('年柱');
      expect(tianyi?.positions).toContain('月柱');
    });
  });

  describe('文昌貴人', () => {
    it('日干甲在巳支應找到文昌貴人', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '巳' }, // 年支巳
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '辰' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const wenchang = findShenSha(result, '文昌貴人');
      expect(wenchang).toBeDefined();
      expect(wenchang?.type).toBe('吉');
    });
  });

  describe('桃花', () => {
    it('日支子（申子辰局）見酉應找到桃花', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '酉' }, // 年支酉
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日支子（申子辰見酉）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const taohua = findShenSha(result, '桃花');
      expect(taohua).toBeDefined();
      expect(taohua?.type).toBe('中');
    });
  });

  describe('驛馬', () => {
    it('日支子（申子辰局）見寅應找到驛馬', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '丑' },
        { stem: '丙', branch: '寅' }, // 月支寅（驛馬）
        { stem: '甲', branch: '子' }, // 日支子（申子辰見寅）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yima = findShenSha(result, '驛馬');
      expect(yima).toBeDefined();
      expect(yima?.type).toBe('中');
    });
  });

  describe('羊刃', () => {
    it('日干甲見卯支應找到羊刃', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '卯' }, // 年支卯
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '辰' }, // 日干甲（甲羊刃在卯）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yangren = findShenSha(result, '羊刃');
      expect(yangren).toBeDefined();
      expect(yangren?.type).toBe('凶');
    });

    it('日干乙（陰干）不應有羊刃', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '卯' },
        { stem: '丙', branch: '寅' },
        { stem: '乙', branch: '辰' }, // 日干乙（陰干無羊刃）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yangren = findShenSha(result, '羊刃');
      expect(yangren).toBeUndefined();
    });
  });

  describe('魁罡', () => {
    it('庚辰日柱應找到魁罡', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '寅' },
        { stem: '庚', branch: '辰' }, // 庚辰日柱
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const kuigang = findShenSha(result, '魁罡');
      expect(kuigang).toBeDefined();
      expect(kuigang?.type).toBe('中');
      expect(kuigang?.positions).toEqual(['日柱']);
    });

    it('戊戌日柱應找到魁罡', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '寅' },
        { stem: '戊', branch: '戌' }, // 戊戌日柱
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const kuigang = findShenSha(result, '魁罡');
      expect(kuigang).toBeDefined();
    });

    it('庚午日柱不應找到魁罡', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '寅' },
        { stem: '庚', branch: '午' }, // 庚午不是魁罡
        { stem: '庚', branch: '子' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const kuigang = findShenSha(result, '魁罡');
      expect(kuigang).toBeUndefined();
    });
  });

  describe('天羅地網', () => {
    it('同時有辰（天羅）和戌（地網）應找到天羅地網', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '辰' }, // 天羅
        { stem: '丙', branch: '戌' }, // 地網
        { stem: '甲', branch: '子' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianluodiwang = findShenSha(result, '天羅地網');
      expect(tianluodiwang).toBeDefined();
      expect(tianluodiwang?.type).toBe('凶');
    });

    it('只有辰（天羅）沒有戌不應找到天羅地網', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '辰' }, // 只有天羅
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianluodiwang = findShenSha(result, '天羅地網');
      expect(tianluodiwang).toBeUndefined();
    });
  });

  describe('三奇貴人', () => {
    it('年月日天干為甲戊庚順序應找到天上三奇', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 甲
        { stem: '戊', branch: '寅' }, // 戊
        { stem: '庚', branch: '辰' }, // 庚（甲戊庚順序）
        { stem: '壬', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const sanqi = findShenSha(result, '天上三奇');
      expect(sanqi).toBeDefined();
      expect(sanqi?.type).toBe('吉');
      expect(sanqi?.positions).toEqual(['年柱', '月柱', '日柱']);
    });

    it('月日時天干為甲戊庚順序應正確追蹤位置', () => {
      const pillars = createPillars(
        { stem: '壬', branch: '子' }, // 不是甲
        { stem: '甲', branch: '寅' }, // 甲
        { stem: '戊', branch: '辰' }, // 戊
        { stem: '庚', branch: '午' } // 庚（從月柱開始）
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const sanqi = findShenSha(result, '天上三奇');
      expect(sanqi).toBeDefined();
      expect(sanqi?.positions).toEqual(['月柱', '日柱', '時柱']);
    });

    it('年月日天干為乙丙丁順序應找到地上三奇', () => {
      const pillars = createPillars(
        { stem: '乙', branch: '子' }, // 乙
        { stem: '丙', branch: '寅' }, // 丙
        { stem: '丁', branch: '辰' }, // 丁（乙丙丁順序）
        { stem: '壬', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const sanqi = findShenSha(result, '地上三奇');
      expect(sanqi).toBeDefined();
    });

    it('天干順序不對不應找到三奇', () => {
      const pillars = createPillars(
        { stem: '戊', branch: '子' }, // 戊
        { stem: '甲', branch: '寅' }, // 甲（順序錯誤）
        { stem: '庚', branch: '辰' }, // 庚
        { stem: '壬', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const sanqi = findShenSha(result, '天上三奇');
      expect(sanqi).toBeUndefined();
    });
  });

  describe('陰陽差錯', () => {
    it('丙子日柱應找到陰陽差錯', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '寅' },
        { stem: '丁', branch: '卯' },
        { stem: '丙', branch: '子' }, // 丙子日柱
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yinyang = findShenSha(result, '陰陽差錯');
      expect(yinyang).toBeDefined();
      expect(yinyang?.type).toBe('凶');
    });
  });

  describe('十惡大敗', () => {
    it('甲辰日柱應找到十惡大敗', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '寅' },
        { stem: '丁', branch: '卯' },
        { stem: '甲', branch: '辰' }, // 甲辰日柱
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const shie = findShenSha(result, '十惡大敗');
      expect(shie).toBeDefined();
      expect(shie?.type).toBe('凶');
    });
  });

  describe('結果排序', () => {
    it('應該按吉、中、凶順序排序', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '丑' }, // 天乙貴人（吉）
        { stem: '丙', branch: '酉' }, // 桃花（中，日支子見酉）
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '卯' } // 羊刃（凶，甲見卯）
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );

      // 檢查排序
      let lastType: '吉' | '中' | '凶' = '吉';
      const typeOrder = { 吉: 0, 中: 1, 凶: 2 };
      for (const shensha of result) {
        expect(typeOrder[shensha.type]).toBeGreaterThanOrEqual(
          typeOrder[lastType]
        );
        lastType = shensha.type;
      }
    });
  });

  describe('孤辰寡宿', () => {
    it('孤辰應排除年柱', () => {
      // 年支亥，孤辰在寅
      const pillars = createPillars(
        { stem: '甲', branch: '亥' }, // 年支亥（孤辰見寅）
        { stem: '丙', branch: '寅' }, // 月支寅
        { stem: '甲', branch: '子' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const guchen = findShenSha(result, '孤辰');
      expect(guchen).toBeDefined();
      expect(guchen?.positions).not.toContain('年柱');
      expect(guchen?.positions).toContain('月柱');
    });
  });

  describe('空結果處理', () => {
    it('沒有匹配的神煞時應返回空數組或只有少數神煞', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '寅' },
        { stem: '戊', branch: '午' },
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      // 結果應該是數組
      expect(Array.isArray(result)).toBe(true);
      // 每個結果都應有必要屬性
      result.forEach((shensha) => {
        expect(shensha).toHaveProperty('name');
        expect(shensha).toHaveProperty('type');
        expect(shensha).toHaveProperty('description');
        expect(shensha).toHaveProperty('positions');
        expect(['吉', '中', '凶']).toContain(shensha.type);
      });
    });
  });

  describe('輸入驗證', () => {
    it('無效天干應返回空數組', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '寅' },
        { stem: '無效', branch: '午' }, // 無效天干
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      expect(result).toEqual([]);
    });

    it('無效地支應返回空數組', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '無效' }, // 無效地支
        { stem: '戊', branch: '午' },
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      expect(result).toEqual([]);
    });
  });

  describe('華蓋', () => {
    it('日支子（申子辰局）見辰應找到華蓋', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '辰' }, // 年支辰（華蓋）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日支子（申子辰見辰）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const huagai = findShenSha(result, '華蓋');
      expect(huagai).toBeDefined();
      expect(huagai?.type).toBe('中');
    });
  });

  describe('將星', () => {
    it('日支子（申子辰局）見子應找到將星', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（將星）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日支子（申子辰見子）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const jiangxing = findShenSha(result, '將星');
      expect(jiangxing).toBeDefined();
      expect(jiangxing?.type).toBe('吉');
    });
  });

  describe('祿神', () => {
    it('日干甲見寅支應找到祿神', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '丑' },
        { stem: '丙', branch: '寅' }, // 月支寅（甲祿在寅）
        { stem: '甲', branch: '辰' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const lushen = findShenSha(result, '祿神');
      expect(lushen).toBeDefined();
      expect(lushen?.type).toBe('吉');
    });
  });

  describe('天德貴人', () => {
    it('月支寅見丁干應找到天德貴人', () => {
      const pillars = createPillars(
        { stem: '丁', branch: '丑' }, // 年干丁
        { stem: '丙', branch: '寅' }, // 月支寅（天德見丁）
        { stem: '甲', branch: '辰' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tiande = findShenSha(result, '天德貴人');
      expect(tiande).toBeDefined();
      expect(tiande?.type).toBe('吉');
    });
  });

  describe('月德貴人', () => {
    it('月支寅見丙干應找到月德貴人', () => {
      const pillars = createPillars(
        { stem: '丙', branch: '丑' }, // 年干丙
        { stem: '甲', branch: '寅' }, // 月支寅（月德見丙）
        { stem: '甲', branch: '辰' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yuede = findShenSha(result, '月德貴人');
      expect(yuede).toBeDefined();
      expect(yuede?.type).toBe('吉');
    });
  });

  describe('金輿', () => {
    it('日干甲見辰支應找到金輿', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '辰' }, // 年支辰（甲金輿在辰）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const jinyu = findShenSha(result, '金輿');
      expect(jinyu).toBeDefined();
      expect(jinyu?.type).toBe('吉');
    });
  });

  describe('劫煞', () => {
    it('日支子（申子辰局）見巳應找到劫煞', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '巳' }, // 年支巳（劫煞）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日支子（申子辰見巳）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const jiesha = findShenSha(result, '劫煞');
      expect(jiesha).toBeDefined();
      expect(jiesha?.type).toBe('凶');
    });
  });

  describe('亡神', () => {
    it('日支子（申子辰局）見亥應找到亡神', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '亥' }, // 年支亥（亡神）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日支子（申子辰見亥）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const wangshen = findShenSha(result, '亡神');
      expect(wangshen).toBeDefined();
      expect(wangshen?.type).toBe('凶');
    });
  });

  describe('寡宿', () => {
    it('寡宿應排除年柱', () => {
      // 年支亥，寡宿在戌
      const pillars = createPillars(
        { stem: '甲', branch: '亥' }, // 年支亥（寡宿見戌）
        { stem: '丙', branch: '戌' }, // 月支戌
        { stem: '甲', branch: '子' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const guasu = findShenSha(result, '寡宿');
      expect(guasu).toBeDefined();
      expect(guasu?.type).toBe('凶');
      expect(guasu?.positions).not.toContain('年柱');
    });
  });

  describe('天廚貴人', () => {
    it('日干甲見巳支應找到天廚貴人', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '巳' }, // 年支巳（甲天廚在巳）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianchu = findShenSha(result, '天廚貴人');
      expect(tianchu).toBeDefined();
      expect(tianchu?.type).toBe('吉');
    });
  });

  describe('福星貴人', () => {
    it('日干甲見寅支應找到福星貴人', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '寅' }, // 年支寅（甲福星在寅）
        { stem: '丙', branch: '卯' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const fuxing = findShenSha(result, '福星貴人');
      expect(fuxing).toBeDefined();
      expect(fuxing?.type).toBe('吉');
    });
  });

  describe('國印貴人', () => {
    it('日干甲見戌支應找到國印貴人', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '戌' }, // 年支戌（甲國印在戌）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const guoyin = findShenSha(result, '國印貴人');
      expect(guoyin).toBeDefined();
      expect(guoyin?.type).toBe('吉');
    });
  });

  describe('學堂', () => {
    it('日干甲見亥支應找到學堂', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '亥' }, // 年支亥（甲學堂在亥）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const xuetang = findShenSha(result, '學堂');
      expect(xuetang).toBeDefined();
      expect(xuetang?.type).toBe('吉');
    });
  });

  describe('詞館', () => {
    it('日干甲見寅支應找到詞館', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '寅' }, // 年支寅（甲詞館在寅）
        { stem: '丙', branch: '卯' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const ciguan = findShenSha(result, '詞館');
      expect(ciguan).toBeDefined();
      expect(ciguan?.type).toBe('吉');
    });
  });

  describe('災煞', () => {
    it('日支子（申子辰局）見午應找到災煞', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '午' }, // 年支午（災煞）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日支子（申子辰見午）
        { stem: '庚', branch: '卯' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const zaisha = findShenSha(result, '災煞');
      expect(zaisha).toBeDefined();
      expect(zaisha?.type).toBe('凶');
    });
  });

  describe('天煞', () => {
    it('日支子（申子辰局）見戌應找到天煞', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '戌' }, // 年支戌（天煞）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日支子（申子辰見戌）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tiansha = findShenSha(result, '天煞');
      expect(tiansha).toBeDefined();
      expect(tiansha?.type).toBe('凶');
    });
  });

  describe('地煞', () => {
    it('日支子（申子辰局）見辰應找到地煞', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '辰' }, // 年支辰（地煞）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日支子（申子辰見辰）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const disha = findShenSha(result, '地煞');
      expect(disha).toBeDefined();
      expect(disha?.type).toBe('凶');
    });
  });

  describe('紅艷煞', () => {
    it('日干甲見午支應找到紅艷煞', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '午' }, // 年支午（甲紅艷在午）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '卯' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const hongyan = findShenSha(result, '紅艷煞');
      expect(hongyan).toBeDefined();
      expect(hongyan?.type).toBe('中');
    });
  });

  describe('流霞煞', () => {
    it('日干甲見酉支應找到流霞煞', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '酉' }, // 年支酉（甲流霞在酉）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const liuxia = findShenSha(result, '流霞煞');
      expect(liuxia).toBeDefined();
      expect(liuxia?.type).toBe('凶');
    });
  });

  describe('血刃', () => {
    it('日干甲見卯支應找到血刃', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '卯' }, // 年支卯（甲血刃在卯）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const xueren = findShenSha(result, '血刃');
      expect(xueren).toBeDefined();
      expect(xueren?.type).toBe('凶');
    });
  });

  describe('天醫', () => {
    it('月支子見亥支應找到天醫', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '亥' }, // 年支亥（子月天醫在亥）
        { stem: '丙', branch: '子' }, // 月支子
        { stem: '甲', branch: '丑' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianyi = findShenSha(result, '天醫');
      expect(tianyi).toBeDefined();
      expect(tianyi?.type).toBe('吉');
    });
  });

  describe('太極貴人', () => {
    it('日干甲見子或午支應找到太極貴人', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（甲太極在子午）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '辰' }, // 日干甲
        { stem: '庚', branch: '午' } // 時支午
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const taiji = findShenSha(result, '太極貴人');
      expect(taiji).toBeDefined();
      expect(taiji?.type).toBe('吉');
      expect(taiji?.positions).toContain('年柱');
      expect(taiji?.positions).toContain('時柱');
    });

    it('日干戊己見四庫（辰戌丑未）應找到太極貴人', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '辰' }, // 年支辰
        { stem: '丙', branch: '戌' }, // 月支戌
        { stem: '戊', branch: '丑' }, // 日干戊，日支丑
        { stem: '庚', branch: '未' } // 時支未
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const taiji = findShenSha(result, '太極貴人');
      expect(taiji).toBeDefined();
      expect(taiji?.positions.length).toBe(4); // 四個柱都匹配
    });
  });

  describe('天喜', () => {
    it('年支子見酉支應找到天喜', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（天喜見酉）
        { stem: '丙', branch: '酉' }, // 月支酉
        { stem: '甲', branch: '丑' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianxi = findShenSha(result, '天喜');
      expect(tianxi).toBeDefined();
      expect(tianxi?.type).toBe('吉');
    });
  });

  describe('紅鸞', () => {
    it('年支子見卯支應找到紅鸞', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（紅鸞見卯）
        { stem: '丙', branch: '卯' }, // 月支卯
        { stem: '甲', branch: '丑' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const hongluan = findShenSha(result, '紅鸞');
      expect(hongluan).toBeDefined();
      expect(hongluan?.type).toBe('吉');
    });
  });

  describe('天赦', () => {
    it('春季寅月戊寅日應找到天赦', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '寅' }, // 月支寅（春季）
        { stem: '戊', branch: '寅' }, // 戊寅日柱
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianshe = findShenSha(result, '天赦');
      expect(tianshe).toBeDefined();
      expect(tianshe?.type).toBe('吉');
    });

    it('夏季午月甲午日應找到天赦', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '午' }, // 月支午（夏季）
        { stem: '甲', branch: '午' }, // 甲午日柱
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianshe = findShenSha(result, '天赦');
      expect(tianshe).toBeDefined();
    });

    it('非天赦日不應找到天赦', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '寅' }, // 月支寅（春季）
        { stem: '甲', branch: '午' }, // 甲午日（春季應是戊寅日才是天赦）
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tianshe = findShenSha(result, '天赦');
      expect(tianshe).toBeUndefined();
    });
  });

  describe('人中三奇', () => {
    it('年月日天干為壬癸辛順序應找到人中三奇', () => {
      const pillars = createPillars(
        { stem: '壬', branch: '子' }, // 壬
        { stem: '癸', branch: '寅' }, // 癸
        { stem: '辛', branch: '辰' }, // 辛（壬癸辛順序）
        { stem: '甲', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const sanqi = findShenSha(result, '人中三奇');
      expect(sanqi).toBeDefined();
      expect(sanqi?.type).toBe('吉');
      expect(sanqi?.positions).toEqual(['年柱', '月柱', '日柱']);
    });
  });

  describe('月德合', () => {
    it('月支寅見辛干應找到月德合', () => {
      const pillars = createPillars(
        { stem: '辛', branch: '丑' }, // 年干辛
        { stem: '甲', branch: '寅' }, // 月支寅（月德合見辛）
        { stem: '甲', branch: '辰' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yuedehe = findShenSha(result, '月德合');
      expect(yuedehe).toBeDefined();
      expect(yuedehe?.type).toBe('吉');
    });
  });

  describe('天德合', () => {
    it('月支寅見壬干應找到天德合', () => {
      const pillars = createPillars(
        { stem: '壬', branch: '丑' }, // 年干壬
        { stem: '甲', branch: '寅' }, // 月支寅（天德丁合壬）
        { stem: '甲', branch: '辰' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tiandehe = findShenSha(result, '天德合');
      expect(tiandehe).toBeDefined();
      expect(tiandehe?.type).toBe('吉');
    });
  });

  describe('六秀日', () => {
    it('丙午日柱應找到六秀日', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丁', branch: '卯' },
        { stem: '丙', branch: '午' }, // 丙午日柱
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const liuxiu = findShenSha(result, '六秀日');
      expect(liuxiu).toBeDefined();
      expect(liuxiu?.type).toBe('吉');
    });

    it('癸酉日柱應找到六秀日', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丁', branch: '卯' },
        { stem: '癸', branch: '酉' }, // 癸酉日柱
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const liuxiu = findShenSha(result, '六秀日');
      expect(liuxiu).toBeDefined();
    });
  });

  describe('八專日', () => {
    it('甲寅日柱應找到八專日', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丁', branch: '卯' },
        { stem: '甲', branch: '寅' }, // 甲寅日柱
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const bazhuan = findShenSha(result, '八專日');
      expect(bazhuan).toBeDefined();
      expect(bazhuan?.type).toBe('中');
    });

    it('壬子日柱應找到八專日', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '午' },
        { stem: '丁', branch: '卯' },
        { stem: '壬', branch: '子' }, // 壬子日柱
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const bazhuan = findShenSha(result, '八專日');
      expect(bazhuan).toBeDefined();
    });
  });

  describe('弔客', () => {
    it('年支子見戌支應找到弔客', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（弔客見戌）
        { stem: '丙', branch: '戌' }, // 月支戌
        { stem: '甲', branch: '丑' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const diaoke = findShenSha(result, '弔客');
      expect(diaoke).toBeDefined();
      expect(diaoke?.type).toBe('凶');
    });
  });

  describe('天狗', () => {
    it('年支子見戌支應找到天狗', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（天狗見戌）
        { stem: '丙', branch: '戌' }, // 月支戌
        { stem: '甲', branch: '丑' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const tiangou = findShenSha(result, '天狗');
      expect(tiangou).toBeDefined();
      expect(tiangou?.type).toBe('凶');
    });
  });

  describe('截空', () => {
    it('甲子旬日柱見戌亥支應找到截空', () => {
      // 甲子旬：甲子、乙丑、丙寅、丁卯、戊辰、己巳、庚午、辛未、壬申、癸酉
      // 空亡：戌、亥
      const pillars = createPillars(
        { stem: '甲', branch: '戌' }, // 年支戌（空亡）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '子' }, // 甲子日柱（甲子旬）
        { stem: '庚', branch: '亥' } // 時支亥（空亡）
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const kongwang = findShenSha(result, '截空');
      expect(kongwang).toBeDefined();
      expect(kongwang?.type).toBe('凶');
      expect(kongwang?.positions).toContain('年柱');
      expect(kongwang?.positions).toContain('時柱');
    });

    it('甲寅旬日柱見子丑支應找到截空', () => {
      // 甲寅旬空亡：子、丑
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（空亡）
        { stem: '丙', branch: '丑' }, // 月支丑（空亡）
        { stem: '甲', branch: '寅' }, // 甲寅日柱（甲寅旬）
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const kongwang = findShenSha(result, '截空');
      expect(kongwang).toBeDefined();
      expect(kongwang?.positions).toContain('年柱');
      expect(kongwang?.positions).toContain('月柱');
    });
  });

  describe('沐浴', () => {
    it('日干甲見子支應找到沐浴', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（甲沐浴在子）
        { stem: '丙', branch: '寅' },
        { stem: '甲', branch: '辰' }, // 日干甲
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const muyu = findShenSha(result, '沐浴');
      expect(muyu).toBeDefined();
      expect(muyu?.type).toBe('中');
    });

    it('日干庚見午支應找到沐浴', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '午' }, // 年支午（庚沐浴在午）
        { stem: '丙', branch: '寅' },
        { stem: '庚', branch: '辰' }, // 日干庚
        { stem: '壬', branch: '子' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const muyu = findShenSha(result, '沐浴');
      expect(muyu).toBeDefined();
    });
  });

  describe('月破', () => {
    it('月支子日支午應找到月破', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '寅' },
        { stem: '丙', branch: '子' }, // 月支子
        { stem: '甲', branch: '午' }, // 日支午（子午對沖）
        { stem: '庚', branch: '申' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yuepo = findShenSha(result, '月破');
      expect(yuepo).toBeDefined();
      expect(yuepo?.type).toBe('凶');
      expect(yuepo?.positions).toContain('日柱');
    });

    it('月支寅時支申應找到月破', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' },
        { stem: '丙', branch: '寅' }, // 月支寅
        { stem: '甲', branch: '辰' },
        { stem: '庚', branch: '申' } // 時支申（寅申對沖）
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yuepo = findShenSha(result, '月破');
      expect(yuepo).toBeDefined();
      expect(yuepo?.positions).toContain('時柱');
    });
  });

  describe('隔角', () => {
    it('年支子見寅支應找到隔角', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（隔角見寅戌）
        { stem: '丙', branch: '寅' }, // 月支寅
        { stem: '甲', branch: '辰' },
        { stem: '庚', branch: '午' }
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const gejiao = findShenSha(result, '隔角');
      expect(gejiao).toBeDefined();
      expect(gejiao?.type).toBe('凶');
      expect(gejiao?.positions).toContain('月柱');
    });
  });

  describe('元辰', () => {
    it('年支子見未支或午支應找到元辰', () => {
      const pillars = createPillars(
        { stem: '甲', branch: '子' }, // 年支子（元辰見未/午）
        { stem: '丙', branch: '未' }, // 月支未
        { stem: '甲', branch: '辰' },
        { stem: '庚', branch: '午' } // 時支午
      );
      const result = calculateBaZiShenSha(
        pillars.year,
        pillars.month,
        pillars.day,
        pillars.hour
      );
      const yuanchen = findShenSha(result, '元辰');
      expect(yuanchen).toBeDefined();
      expect(yuanchen?.type).toBe('凶');
    });
  });
});
