import { useState } from 'react';
import { BaZiForm } from './components/BaZiForm';
import { BaZiResult } from './components/BaZiResult';
import { calculateBaZi, validateBirthInfo } from './utils/baziHelper';
import type { BirthInfo, BaZiResult as BaZiResultType } from './utils/baziHelper';

function App() {
  const [result, setResult] = useState<BaZiResultType | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = (birthInfo: BirthInfo) => {
    // 驗證輸入
    const validation = validateBirthInfo(birthInfo);
    if (!validation.valid) {
      setError(validation.error || '輸入錯誤');
      setResult(null);
      return;
    }

    try {
      // 計算八字
      const baziResult = calculateBaZi(birthInfo);
      setResult(baziResult);
      setError('');
    } catch (err) {
      setError('計算出錯，請檢查輸入是否正確');
      setResult(null);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-ink-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 標題 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-ink-black mb-4">
            八字排盤
          </h1>
          <p className="text-lg text-gray-600">
            BaZi Calculator - 傳統命理推算工具
          </p>
        </div>

        {/* 表單 */}
        <BaZiForm onCalculate={handleCalculate} />

        {/* 錯誤提示 */}
        {error && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* 結果展示 */}
        {result && <BaZiResult result={result} />}

        {/* 頁腳 */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>使用 tyme4ts 庫進行精確計算</p>
          <p className="mt-2">Built with React + TypeScript + Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
