# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BaZi Calculator (八字排盤) is a comprehensive Chinese astrology web application that calculates the Four Pillars of Destiny based on birth date/time and location. It uses traditional Chinese calendar calculations with true solar time corrections (longitude + DST), and provides complete analysis including:

- **Four Pillars (四柱)**: Year, Month, Day, Hour pillars with Heavenly Stems and Earthly Branches
- **Ten Gods (十神)**: Both primary stars (天干) and secondary stars (藏干/hidden stems) relationships
- **Five Elements (五行)**: Complete distribution analysis with strength indicators
- **Day Master (日主)**: Strength calculation and analysis (strong/weak determination)
- **Favorable Elements (喜神/忌神)**: Automatic calculation based on Day Master strength
- **True Solar Time (真太陽時)**: Precise time correction based on longitude and DST

## Commands

```bash
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Type-check with tsc and build for production
npm run lint       # Run ESLint
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once
npm run preview    # Preview production build
```

Run a single test file:
```bash
npx vitest run src/utils/baziHelper.test.ts
```

## Architecture

### Core Calculation Flow

1. **User Input** (`BaZiForm.tsx`) → collects birth date/time and location
2. **True Solar Time** (`trueSolarTime.ts`) → converts local time to mean solar time using:
   - IANA timezone for DST handling (via Luxon)
   - Longitude-based correction (4 minutes per degree)
3. **BaZi Calculation** (`baziHelper.ts`) → uses `tyme4ts` library to compute:
   - Four Pillars (Year, Month, Day, Hour)
   - Hidden Stems for each Earthly Branch
   - Ten Gods (十神) for Heavenly Stems and Hidden Stems
   - Lunar calendar date
   - Five Elements distribution
4. **Ten Gods Calculation** (`fiveElements.ts`) → calculates:
   - Ten Gods (十神) relationships based on Five Elements interactions
   - Both primary stems (天干) and hidden stems (藏干) Ten Gods
5. **Five Elements Analysis** (`fiveElements.ts`) → calculates:
   - Day Master (日主) from Day Pillar's Heavenly Stem
   - Day Master Strength (日主強弱) based on supporting vs draining elements
   - Favorable Elements (喜神) and Unfavorable Elements (忌神)
6. **Result Display** (`BaZiResult.tsx`) → shows pillars, Ten Gods, Day Master analysis, and Five Elements

### Key Dependencies

- **tyme4ts**: Core library for Chinese calendar and BaZi calculations
- **luxon**: Timezone and DST handling for true solar time
- UI: React 19, Tailwind CSS, Vite

### Data Structures

- `BirthInfo`: Input data (gender, date, time, optional city)
- `Pillar`: Heavenly Stem + Earthly Branch + Hidden Stems + Hidden Stems with Ten Gods
- `HiddenStemWithTenGod`: Hidden stem paired with its Ten God relationship
- `BaZiResult`: Complete calculation output including solar/lunar dates, pillars, ten gods, five elements count, and correction info
- `City`: Location data with longitude and IANA timezone for solar time calculation
- `FiveElementsCount`: Count of each Five Element (金木水火土) in the chart
- `TenGod`: Ten Gods types (比肩, 劫財, 食神, 傷官, 偏財, 正財, 七殺, 正官, 偏印, 正印)
- `PillarTenGods`: Ten Gods for each pillar's heavenly stem (year, month, day=null, hour)
- `DayMasterInfo`: Day Master stem, element, and display name (e.g., "己土")
- `DayMasterStrength`: Day Master strength analysis (same-type vs different-type count)
- `FavorableElements`: Favorable (喜神) and unfavorable (忌神) elements based on Day Master strength

### Five Elements Calculation Rules

**Day Master Strength (日主強弱)**:
- Same-type (同類): Elements that support the Day Master (生我 + 比我)
- Different-type (異類): Elements that drain the Day Master (我生 + 克我 + 我克)
- Strong if same-type ≥ different-type; Weak if same-type < different-type

**Favorable/Unfavorable Elements (喜神/忌神)**:
- Day Master Strong → Favorable: draining elements; Unfavorable: supporting elements
- Day Master Weak → Favorable: supporting elements; Unfavorable: draining elements

**Five Elements Color Scheme**:
- 金 (Metal): Slate/Silver
- 木 (Wood): Green
- 水 (Water): Blue
- 火 (Fire): Red
- 土 (Earth): Amber

### Ten Gods Calculation Rules

**Ten Gods (十神)** represent the relationships between stems based on Five Elements interactions and yin/yang polarity:

**Same Element**:
- Same polarity → **比肩** (Siblings/Equals)
- Different polarity → **劫財** (Robbery of Wealth)

**Day Master Generates (我生)**:
- Same polarity → **食神** (Eating God)
- Different polarity → **傷官** (Hurting Officer)

**Day Master Controls (我克)**:
- Same polarity → **偏財** (Partial Wealth)
- Different polarity → **正財** (Direct Wealth)

**Controls Day Master (克我)**:
- Same polarity → **七殺** (Seven Killings)
- Different polarity → **正官** (Direct Officer)

**Generates Day Master (生我)**:
- Same polarity → **偏印** (Partial Seal)
- Different polarity → **正印** (Direct Seal)

**Ten Gods Display**:
- Primary Stars (主星): Ten Gods for heavenly stems in year, month, and hour pillars
- Secondary Stars (副星): Ten Gods for hidden stems (藏干) in all earthly branches
- Day pillar has no Ten God as it represents the Day Master (日主) itself

### Important Calculation Rules

- Year pillar boundary: 立春 (Start of Spring) around Feb 4, not Jan 1
- Month pillar boundary: Based on solar terms (節氣)
- Default location: Hong Kong (for solar time calculations)
- Supported year range: 1900-2100

## Language

- UI text is bilingual (Traditional Chinese primary, English secondary)
- Code comments are in Traditional Chinese
- Use `chineseConverter.ts` for Simplified → Traditional conversion when needed
