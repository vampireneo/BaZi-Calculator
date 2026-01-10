import React from 'react';
import type { BaZiResult as BaZiResultType, Pillar } from '../utils/baziHelper';

interface BaZiResultProps {
  result: BaZiResultType;
}

const PillarCard: React.FC<{ title: string; pillar: Pillar }> = ({ title, pillar }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-ink-red transition-all duration-300 transform hover:scale-105">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      </div>

      {/* 天干 */}
      <div className="mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">天干</div>
          <div className="text-6xl font-bold text-ink-black">
            {pillar.heavenlyStem}
          </div>
        </div>
      </div>

      {/* 地支 */}
      <div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">地支</div>
          <div className="text-6xl font-bold text-ink-red">
            {pillar.earthlyBranch}
          </div>
        </div>
      </div>

      {/* 藏干 */}
      {pillar.hiddenStems && pillar.hiddenStems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">藏干</div>
            <div className="text-sm font-medium text-gray-700">
              {pillar.hiddenStems.join(' ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const BaZiResult: React.FC<BaZiResultProps> = ({ result }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-12 animate-fade-in">
      {/* 基本信息 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-500 mb-1">性别</div>
            <div className="text-xl font-semibold text-ink-black">{result.gender}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">公历</div>
            <div className="text-xl font-semibold text-ink-black">{result.solarDate}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">农历</div>
            <div className="text-xl font-semibold text-ink-black">{result.lunarDate}</div>
          </div>
        </div>
      </div>

      {/* 四柱展示 */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-ink-black">
          四柱八字
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <PillarCard title="年柱 Year" pillar={result.yearPillar} />
          <PillarCard title="月柱 Month" pillar={result.monthPillar} />
          <PillarCard title="日柱 Day" pillar={result.dayPillar} />
          <PillarCard title="时柱 Hour" pillar={result.hourPillar} />
        </div>
      </div>

      {/* 印章装饰 */}
      <div className="flex justify-center mt-8">
        <div className="w-20 h-20 bg-ink-red rounded-lg flex items-center justify-center transform rotate-12 shadow-lg">
          <span className="text-white text-2xl font-bold">命</span>
        </div>
      </div>
    </div>
  );
};
