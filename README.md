# 八字排盤網頁應用 | BaZi Calculator Web App

一個基於現代前端技術棧構建的八字排盤網頁應用，採用傳統水墨風格設計，提供準確的四柱八字計算功能。

## ✨ 功能特性

- **精確計算**: 使用 `lunar-javascript` 庫進行精確的農曆轉換和八字計算
- **優雅介面**: 採用水墨風格設計，簡約現代的東方美學
- **響應式設計**: 完美支援桌面端和流動裝置
- **流暢動畫**: 平滑的過渡效果和淡入動畫
- **輸入驗證**: 完善的日期時間驗證機制

## 🛠 技術棧

- **框架**: React 18
- **構建工具**: Vite
- **語言**: TypeScript
- **樣式**: Tailwind CSS 3.x
- **核心算法**: lunar-javascript

## 📋 功能說明

### 輸入資訊
- 性別選擇（男/女）
- 出生日期（公曆年月日）
- 出生時間（24小時制時分）

### 輸出結果
- 公曆和農曆日期顯示
- 四柱八字展示：
  - 年柱（天干地支）
  - 月柱（天干地支）
  - 日柱（天干地支）
  - 時柱（天干地支）
- 地支藏干資訊

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用將在 `http://localhost:5173` 啟動

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 📁 專案結構

```
src/
├── components/
│   ├── BaZiForm.tsx      # 輸入表單組件
│   └── BaZiResult.tsx    # 結果展示組件
├── utils/
│   └── baziHelper.ts     # 八字計算工具函數
├── App.tsx               # 主應用組件
├── index.css             # 全域樣式
└── lunar-javascript.d.ts # lunar-javascript 類型聲明
```

## 🎨 設計特色

- **配色方案**：
  - 背景: 米白色 (#fdfbf7)
  - 主文字: 深灰色 (#333333)
  - 強調色: 朱紅色 (#b91c1c)

- **字體**: 使用襯線體以符合傳統東方主題

- **互動**：
  - 按鈕懸停效果
  - 卡片縮放動畫
  - 結果淡入效果

## 📖 使用範例

1. 選擇性別
2. 輸入出生日期（例如：1990年1月1日）
3. 輸入出生時間（例如：12時30分）
4. 點擊「開始排盤」按鈕
5. 查看四柱八字結果

## ⚠️ 注意事項

- 年柱以「立春」為界
- 月柱以「節氣」為界
- 夜子時（23:00-00:00）按照傳統規則處理
- 支援的年份範圍：1900-2100

## 📄 License

MIT

## 🙏 致謝

- [lunar-javascript](https://github.com/6tail/lunar-javascript) - 提供精確的農曆和八字計算
- [Tailwind CSS](https://tailwindcss.com/) - 強大的 CSS 框架
- [Vite](https://vitejs.dev/) - 快速的構建工具
