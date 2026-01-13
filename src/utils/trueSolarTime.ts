/**
 * 真太陽時計算模組
 * 使用 Luxon 處理時區與 DST，計算經度校正和均時差修正後的真太陽時
 */

import { DateTime } from 'luxon';
import type { City } from './cities';
import { calculateEquationOfTime } from './equationOfTime';

export interface TrueSolarTimeResult {
  /** 校正後的年份 */
  year: number;
  /** 校正後的月份 */
  month: number;
  /** 校正後的日期 */
  day: number;
  /** 校正後的小時 */
  hour: number;
  /** 校正後的分鐘 */
  minute: number;
  /** 校正後的秒數 */
  second: number;
  /** 是否處於日光節約時間 */
  isDST: boolean;
  /** DST 偏移量（分鐘） */
  dstOffsetMinutes: number;
  /** 經度校正量（分鐘） */
  longitudeOffsetMinutes: number;
  /** 均時差（分鐘） */
  equationOfTimeMinutes: number;
  /** 原始 UTC 時間 */
  utcTime: DateTime;
  /** 平太陽時 DateTime */
  meanSolarTime: DateTime;
  /** 真太陽時 DateTime（包含均時差修正） */
  trueSolarTime: DateTime;
}

/**
 * 計算真太陽時（傳統八字方法）
 *
 * 計算步驟：
 * 1. 使用 Luxon 解析用戶輸入的當地時間（自動處理 DST）
 * 2. 計算均時差
 * 3. 本地時間 + 均時差 = 真太陽時
 *
 * 注意：此方法採用傳統八字排盤的簡化計算方式，
 * 將本地標準時間視為地方平太陽時，只加上均時差修正。
 * 未考慮城市經度與標準時區中央經線的差異。
 *
 * @param year 年份
 * @param month 月份 (1-12)
 * @param day 日期 (1-31)
 * @param hour 小時 (0-23)
 * @param minute 分鐘 (0-59)
 * @param city 城市資料（包含經度和 IANA 時區）
 * @returns 真太陽時計算結果
 */
export function calculateTrueSolarTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  city: City
): TrueSolarTimeResult {
  // Step 1: 使用 Luxon 解析用戶輸入的當地時間
  // DateTime.fromObject 會自動處理該日期是否處於 DST
  const localTime = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone: city.iana }
  );

  // 檢查是否處於日光節約時間
  const isDST = localTime.isInDST;

  // 獲取 DST 偏移量（與標準時間的差異，分鐘）
  // offset 是總偏移量（包含標準時區偏移 + DST），需要計算 DST 部分
  const standardOffset = DateTime.fromObject(
    { year, month: 1, day: 1, hour: 12 }, // 使用一月來獲取標準時間偏移
    { zone: city.iana }
  ).offset;
  const currentOffset = localTime.offset;
  const dstOffsetMinutes = currentOffset - standardOffset;

  // Step 2: 轉換為 UTC 時間（用於計算均時差）
  const utcTime = localTime.toUTC();

  // Step 3: 計算經度時差（僅供參考，傳統方法不使用）
  // 每度經度 = 4 分鐘時差
  // 東經為正，表示比 UTC 更早看到太陽
  const longitudeOffsetMinutes = city.longitude * 4;

  // Step 4: 傳統方法將本地時間視為地方平太陽時
  const meanSolarTime = localTime;

  // Step 5: 計算均時差並得到真太陽時
  // 使用 UTC 日期來計算均時差（因為均時差是基於地球相對太陽的位置）
  const equationOfTimeMinutes = calculateEquationOfTime(
    utcTime.year,
    utcTime.month,
    utcTime.day
  );

  // 真太陽時 = 本地時間 + 均時差（傳統八字方法）
  const trueSolarTime = localTime.plus({ minutes: equationOfTimeMinutes });

  return {
    year: trueSolarTime.year,
    month: trueSolarTime.month,
    day: trueSolarTime.day,
    hour: trueSolarTime.hour,
    minute: trueSolarTime.minute,
    second: trueSolarTime.second,
    isDST,
    dstOffsetMinutes,
    longitudeOffsetMinutes,
    equationOfTimeMinutes,
    utcTime,
    meanSolarTime,
    trueSolarTime,
  };
}

/**
 * 格式化時間校正資訊
 * @param result 真太陽時計算結果
 * @returns 格式化的校正資訊字串
 */
export function formatCorrectionInfo(result: TrueSolarTimeResult): string {
  const dstInfo = result.isDST
    ? `DST +${result.dstOffsetMinutes}分鐘`
    : '非DST';

  const longitudeInfo = result.longitudeOffsetMinutes >= 0
    ? `經度 +${result.longitudeOffsetMinutes.toFixed(1)}分`
    : `經度 ${result.longitudeOffsetMinutes.toFixed(1)}分`;

  const eotInfo = result.equationOfTimeMinutes >= 0
    ? `均時差 +${result.equationOfTimeMinutes.toFixed(1)}分`
    : `均時差 ${result.equationOfTimeMinutes.toFixed(1)}分`;

  return `${dstInfo} | ${longitudeInfo} | ${eotInfo}`;
}

/**
 * 獲取校正後的時間字串
 * @param result 真太陽時計算結果
 * @returns 格式化的時間字串
 */
export function formatCorrectedTime(result: TrueSolarTimeResult): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${result.year}年${pad(result.month)}月${pad(result.day)}日 ${pad(result.hour)}:${pad(result.minute)}`;
}
