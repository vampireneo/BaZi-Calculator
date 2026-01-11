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
      {/* 基本資訊 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-500 mb-1">性別</div>
            <div className="text-xl font-semibold text-ink-black">{result.gender}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">公曆</div>
            <div className="text-xl font-semibold text-ink-black">{result.solarDate}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">農曆</div>
            <div className="text-xl font-semibold text-ink-black">{result.lunarDate}</div>
          </div>
        </div>
      </div>

      {/* 真太陽時校正資訊 */}
      {result.correctionInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-4 mb-8 border border-blue-200">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-blue-800">
              已校正經度與日光節約時間 (DST)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-center text-sm">
            <div className="bg-white/60 rounded-md p-2">
              <div className="text-gray-500 text-xs mb-1">出生地點</div>
              <div className="font-medium text-gray-800">{result.correctionInfo.cityName}</div>
            </div>
            <div className="bg-white/60 rounded-md p-2">
              <div className="text-gray-500 text-xs mb-1">真太陽時</div>
              <div className="font-medium text-gray-800">{result.correctionInfo.correctedTime}</div>
            </div>
            <div className="bg-white/60 rounded-md p-2">
              <div className="text-gray-500 text-xs mb-1">DST 狀態</div>
              <div className={`font-medium ${result.correctionInfo.isDST ? 'text-orange-600' : 'text-gray-600'}`}>
                {result.correctionInfo.isDST ? `夏令時間 (+${result.correctionInfo.dstOffsetMinutes}分鐘)` : '標準時間'}
              </div>
            </div>
            <div className="bg-white/60 rounded-md p-2">
              <div className="text-gray-500 text-xs mb-1">經度校正</div>
              <div className="font-medium text-gray-800">
                {result.correctionInfo.longitudeOffsetMinutes >= 0 ? '+' : ''}{result.correctionInfo.longitudeOffsetMinutes.toFixed(1)} 分鐘
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 四柱展示 */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-ink-black">
          四柱八字
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <PillarCard title="年柱 Year" pillar={result.yearPillar} />
          <PillarCard title="月柱 Month" pillar={result.monthPillar} />
          <PillarCard title="日柱 Day" pillar={result.dayPillar} />
          <PillarCard title="時柱 Hour" pillar={result.hourPillar} />
        </div>
      </div>

      {/* 印章裝飾 */}
      <div className="flex justify-center mt-8">
        <div className="w-20 h-20 bg-ink-red rounded-lg flex items-center justify-center transform rotate-12 shadow-lg">
          <span className="text-white text-2xl font-bold">命</span>
        </div>
      </div>
    </div>
  );
};
