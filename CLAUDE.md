# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BaZi Calculator (八字排盤) is a Chinese astrology web application that calculates the Four Pillars of Destiny based on birth date/time. It uses traditional Chinese calendar calculations with true solar time corrections.

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
   - Lunar calendar date
4. **Result Display** (`BaZiResult.tsx`) → shows pillars with Chinese characters

### Key Dependencies

- **tyme4ts**: Core library for Chinese calendar and BaZi calculations
- **luxon**: Timezone and DST handling for true solar time
- UI: React 19, Tailwind CSS, Vite

### Data Structures

- `BirthInfo`: Input data (gender, date, time, optional city)
- `Pillar`: Heavenly Stem + Earthly Branch + Hidden Stems
- `BaZiResult`: Complete calculation output including solar/lunar dates and correction info
- `City`: Location data with longitude and IANA timezone for solar time calculation

### Important Calculation Rules

- Year pillar boundary: 立春 (Start of Spring) around Feb 4, not Jan 1
- Month pillar boundary: Based on solar terms (節氣)
- Default location: Hong Kong (for solar time calculations)
- Supported year range: 1900-2100

## Language

- UI text is bilingual (Traditional Chinese primary, English secondary)
- Code comments are in Traditional Chinese
- Use `chineseConverter.ts` for Simplified → Traditional conversion when needed
