import React, { useState } from 'react';
import type { BirthInfo } from '../utils/baziHelper';

interface BaZiFormProps {
  onCalculate: (birthInfo: BirthInfo) => void;
}

export const BaZiForm: React.FC<BaZiFormProps> = ({ onCalculate }) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const birthInfo: BirthInfo = {
      gender,
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
    };

    onCalculate(birthInfo);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-ink-black">
          八字排盘
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 性别选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink-black">
              性别 Gender
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

          {/* 出生日期 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink-black">
              出生日期 Date of Birth (公历/Gregorian)
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

          {/* 出生时间 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink-black">
              出生时间 Time of Birth (24小时制)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="时 Hour"
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

          {/* 提交按钮 */}
          <button
            type="submit"
            className="w-full bg-ink-red text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-red-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            开始排盘 Calculate
          </button>
        </form>
      </div>
    </div>
  );
};
