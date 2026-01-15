import React from 'react';
import type { BaZiResult as BaZiResultType, Pillar } from '../utils/baziHelper';
import {
  getFiveElementStrength,
  getMissingElements,
  getDayMasterInfo,
  calculateDayMasterStrength,
  calculateFavorableElements,
} from '../utils/fiveElements';
import type { FiveElement, TenGod } from '../utils/fiveElements';

interface BaZiResultProps {
  result: BaZiResultType;
}

const PillarCard: React.FC<{ title: string; pillar: Pillar; tenGod?: TenGod | null; gender?: string }> = ({ title, pillar, tenGod, gender }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-ink-red transition-all duration-300 transform hover:scale-105">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      </div>

      {/* 十神或性別 */}
      {tenGod && (
        <div className="mb-3">
          <div className="text-center">
            <div className="inline-block bg-purple-100 border-2 border-purple-300 rounded-lg px-3 py-1">
              <span className="text-lg font-bold text-purple-700">{tenGod}</span>
            </div>
          </div>
        </div>
      )}
      {gender && (
        <div className="mb-3">
          <div className="text-center">
            <div className="inline-block bg-blue-100 border-2 border-blue-300 rounded-lg px-3 py-1">
              <span className="text-lg font-bold text-blue-700">元{gender}</span>
            </div>
          </div>
        </div>
      )}

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

// 五行顏色配置
const ELEMENT_COLORS: Record<FiveElement, { bg: string; text: string; border: string }> = {
  金: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-400' },
  木: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-300' },
  水: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
  火: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300' },
  土: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
};

const FiveElementsDisplay: React.FC<{ result: BaZiResultType }> = ({ result }) => {
  const { fiveElements, dayPillar } = result;
  const missingElements = getMissingElements(fiveElements);

  // 計算日主資訊
  const dayMasterInfo = getDayMasterInfo(dayPillar.heavenlyStem);
  const dayMasterStrength = dayMasterInfo
    ? calculateDayMasterStrength(dayMasterInfo.element, fiveElements)
    : null;
  const favorableElements =
    dayMasterInfo && dayMasterStrength
      ? calculateFavorableElements(dayMasterInfo.element, dayMasterStrength)
      : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
      {/* 日主五行 */}
      {dayMasterInfo && dayMasterStrength && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-4 text-ink-black">
            日主五行 Day Master
          </h2>
          <div className="flex justify-center items-center gap-6">
            <div
              className={`${ELEMENT_COLORS[dayMasterInfo.element].bg} ${ELEMENT_COLORS[dayMasterInfo.element].border} border-2 rounded-xl p-6 text-center`}
            >
              <div
                className={`text-4xl font-bold ${ELEMENT_COLORS[dayMasterInfo.element].text} mb-2`}
              >
                {dayMasterInfo.displayName}
              </div>
              <div className="text-sm text-gray-600">日主</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ink-black mb-1">
                {dayMasterStrength.strengthLabel}
              </div>
              <div className="text-sm text-gray-500">
                同類 {dayMasterStrength.sameTypeCount} / 異類{' '}
                {dayMasterStrength.differentTypeCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 喜神忌神 */}
      {favorableElements && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-4 text-ink-black">
            喜神忌神 Favorable Elements
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* 喜神 */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4">
              <div className="text-center mb-3">
                <span className="text-lg font-bold text-emerald-700">喜神</span>
                <span className="text-sm text-emerald-600 ml-2">Favorable</span>
              </div>
              <div className="flex justify-center gap-2">
                {favorableElements.favorable.map((element) => (
                  <div
                    key={element}
                    className={`${ELEMENT_COLORS[element].bg} ${ELEMENT_COLORS[element].border} border-2 rounded-lg px-4 py-2`}
                  >
                    <span
                      className={`text-2xl font-bold ${ELEMENT_COLORS[element].text}`}
                    >
                      {element}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* 忌神 */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-lg p-4">
              <div className="text-center mb-3">
                <span className="text-lg font-bold text-rose-700">忌神</span>
                <span className="text-sm text-rose-600 ml-2">Unfavorable</span>
              </div>
              <div className="flex justify-center gap-2">
                {favorableElements.unfavorable.map((element) => (
                  <div
                    key={element}
                    className={`${ELEMENT_COLORS[element].bg} ${ELEMENT_COLORS[element].border} border-2 rounded-lg px-4 py-2`}
                  >
                    <span
                      className={`text-2xl font-bold ${ELEMENT_COLORS[element].text}`}
                    >
                      {element}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center mt-3 text-sm text-gray-600">
            {favorableElements.explanation}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-6 text-ink-black">
        五行分佈 Five Elements
      </h2>

      {/* 五行統計圖 */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {(Object.keys(fiveElements) as FiveElement[]).map((element) => {
          const count = fiveElements[element];
          const colors = ELEMENT_COLORS[element];
          const strength = getFiveElementStrength(count);

          return (
            <div
              key={element}
              className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105`}
            >
              <div className={`text-3xl font-bold ${colors.text} mb-2`}>
                {element}
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {count}
              </div>
              <div className={`text-sm font-medium ${colors.text}`}>
                {strength}
              </div>
            </div>
          );
        })}
      </div>

      {/* 缺失五行提示 */}
      {missingElements.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
          <div className="text-sm text-orange-600 font-medium mb-1">
            五行缺失
          </div>
          <div className="text-xl font-bold text-orange-800">
            {missingElements.join('、')}
          </div>
        </div>
      )}

      {missingElements.length === 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-emerald-800">五行俱全</div>
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

        <div className="grid grid-cols-4 gap-2 md:gap-6">
          <PillarCard title="時柱 Hour" pillar={result.hourPillar} tenGod={result.tenGods.hour} />
          <PillarCard title="日柱 Day" pillar={result.dayPillar} gender={result.gender} />
          <PillarCard title="月柱 Month" pillar={result.monthPillar} tenGod={result.tenGods.month} />
          <PillarCard title="年柱 Year" pillar={result.yearPillar} tenGod={result.tenGods.year} />
        </div>
      </div>

      {/* 五行分佈 */}
      <FiveElementsDisplay result={result} />

      {/* 印章裝飾 */}
      <div className="flex justify-center mt-8">
        <div className="w-20 h-20 bg-ink-red rounded-lg flex items-center justify-center transform rotate-12 shadow-lg">
          <span className="text-white text-2xl font-bold">命</span>
        </div>
      </div>
    </div>
  );
};
