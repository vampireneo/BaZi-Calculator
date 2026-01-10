# 八字排盘网页应用 | BaZi Calculator Web App

一个基于现代前端技术栈构建的八字排盘网页应用，采用传统水墨风格设计，提供准确的四柱八字计算功能。

## ✨ 功能特性

- **精确计算**: 使用 `lunar-javascript` 库进行精确的农历转换和八字计算
- **优雅界面**: 采用水墨风格设计，简约现代的东方美学
- **响应式设计**: 完美支持桌面端和移动端
- **流畅动画**: 平滑的过渡效果和淡入动画
- **输入验证**: 完善的日期时间验证机制

## 🛠 技术栈

- **框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript
- **样式**: Tailwind CSS 3.x
- **核心算法**: lunar-javascript

## 📋 功能说明

### 输入信息
- 性别选择（男/女）
- 出生日期（公历年月日）
- 出生时间（24小时制时分）

### 输出结果
- 公历和农历日期显示
- 四柱八字展示：
  - 年柱（天干地支）
  - 月柱（天干地支）
  - 日柱（天干地支）
  - 时柱（天干地支）
- 地支藏干信息

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/
│   ├── BaZiForm.tsx      # 输入表单组件
│   └── BaZiResult.tsx    # 结果展示组件
├── utils/
│   └── baziHelper.ts     # 八字计算工具函数
├── App.tsx               # 主应用组件
├── index.css             # 全局样式
└── lunar-javascript.d.ts # lunar-javascript 类型声明
```

## 🎨 设计特色

- **配色方案**：
  - 背景: 米白色 (#fdfbf7)
  - 主文字: 深灰色 (#333333)
  - 强调色: 朱红色 (#b91c1c)

- **字体**: 使用衬线体以符合传统东方主题

- **交互**：
  - 按钮悬停效果
  - 卡片缩放动画
  - 结果淡入效果

## 📖 使用示例

1. 选择性别
2. 输入出生日期（例如：1990年1月1日）
3. 输入出生时间（例如：12时30分）
4. 点击"开始排盘"按钮
5. 查看四柱八字结果

## ⚠️ 注意事项

- 年柱以"立春"为界
- 月柱以"节气"为界
- 夜子时（23:00-00:00）按照传统规则处理
- 支持的年份范围：1900-2100

## 📄 License

MIT

## 🙏 致谢

- [lunar-javascript](https://github.com/6tail/lunar-javascript) - 提供精确的农历和八字计算
- [Tailwind CSS](https://tailwindcss.com/) - 强大的 CSS 框架
- [Vite](https://vitejs.dev/) - 快速的构建工具
