import React, { useState, useEffect, useRef } from 'react';
import type { BirthInfo } from '../utils/baziHelper';
import { CITIES, getCityByKey, getDefaultCity } from '../utils/cities';

const BAZI_FORM_DATA_KEY = 'baziCalculator_formData';

interface BaZiFormProps {
  onCalculate: (birthInfo: BirthInfo) => void;
}

interface SavedFormData {
  gender: 'male' | 'female';
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  cityKey: string;
}

export const BaZiForm: React.FC<BaZiFormProps> = ({ onCalculate }) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  const [cityKey, setCityKey] = useState<string>(getDefaultCity().key);
  const isInitialMount = useRef(true);

  // 從 localStorage 載入已保存的表單資料
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(BAZI_FORM_DATA_KEY);
      if (savedData) {
        const formData: SavedFormData = JSON.parse(savedData);

        // 恢復表單欄位
        setGender(formData.gender);
        setYear(formData.year);
        setMonth(formData.month);
        setDay(formData.day);
        setHour(formData.hour);
        setMinute(formData.minute);
        setCityKey(formData.cityKey || getDefaultCity().key);

        // 如果所有必填欄位都有值，自動計算命盤
        if (
          formData.year &&
          formData.month &&
          formData.day &&
          formData.hour &&
          formData.minute
        ) {
          // 延遲執行以確保狀態已更新
          setTimeout(() => {
            const selectedCity = getCityByKey(formData.cityKey) || getDefaultCity();
            const birthInfo: BirthInfo = {
              gender: formData.gender,
              year: parseInt(formData.year),
              month: parseInt(formData.month),
              day: parseInt(formData.day),
              hour: parseInt(formData.hour),
              minute: parseInt(formData.minute),
              city: selectedCity,
            };
            onCalculate(birthInfo);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error);
    }
  }, [onCalculate]);

  // 當表單資料變更時，保存到 localStorage
  useEffect(() => {
    // 跳過初次掛載時的保存
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const formData: SavedFormData = {
      gender,
      year,
      month,
      day,
      hour,
      minute,
      cityKey,
    };

    try {
      localStorage.setItem(BAZI_FORM_DATA_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [gender, year, month, day, hour, minute, cityKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCity = getCityByKey(cityKey) || getDefaultCity();

    const birthInfo: BirthInfo = {
      gender,
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
      city: selectedCity,
    };

    onCalculate(birthInfo);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-ink-black">
          八字排盤
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 性別選擇 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink-black">
              性別 Gender
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                  gender === 'male'
                    ? 'bg-ink-red text-white border-ink-red'
                    : 'bg-white text-ink-black border-gray-300 hover:border-ink-red'
                }`}
              >
                男 Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                  gender === 'female'
                    ? 'bg-ink-red text-white border-ink-red'
                    : 'bg-white text-ink-black border-gray-300 hover:border-ink-red'
                }`}
              >
                女 Female
              </button>
            </div>
          </div>

          {/* 出生地點 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink-black">
              出生地點 Birth Location
            </label>
            <select
              value={cityKey}
              onChange={(e) => setCityKey(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ink-red transition-colors bg-white"
            >
              {CITIES.map((city) => (
                <option key={city.key} value={city.key}>
                  {city.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              用於計算真太陽時，自動處理日光節約時間 (DST)
            </p>
          </div>

          {/* 出生日期 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink-black">
              出生日期 Date of Birth (公曆/Gregorian)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="年 Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max="2100"
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ink-red transition-colors"
              />
              <input
                type="number"
                placeholder="月 Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                min="1"
                max="12"
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ink-red transition-colors"
              />
              <input
                type="number"
                placeholder="日 Day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                min="1"
                max="31"
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ink-red transition-colors"
              />
            </div>
          </div>

          {/* 出生時間 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink-black">
              出生時間 Time of Birth (24小時制)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="時 Hour"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                min="0"
                max="23"
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ink-red transition-colors"
              />
              <input
                type="number"
                placeholder="分 Minute"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                min="0"
                max="59"
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ink-red transition-colors"
              />
            </div>
          </div>

          {/* 提交按鈕 */}
          <button
            type="submit"
            className="w-full bg-ink-red text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-red-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            開始排盤 Calculate
          </button>
        </form>
      </div>
    </div>
  );
};
