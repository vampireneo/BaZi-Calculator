/**
 * 均時差計算模組
 * Equation of Time calculation
 *
 * 均時差是真太陽時與平太陽時之間的差異，由地球橢圓軌道和自轉軸傾斜造成
 * 範圍約在 -16 到 +14 分鐘之間
 */

/**
 * 計算儒略日 (Julian Day Number)
 * @param year 年份
 * @param month 月份 (1-12)
 * @param day 日期
 * @param hour 小時 (0-23)
 * @param minute 分鐘 (0-59)
 * @param second 秒數 (0-59)
 * @returns 儒略日數
 */
function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0
): number {
  // 如果月份是 1 或 2，將年份減 1，月份加 12
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const dayFraction = day + hour / 24 + minute / 1440 + second / 86400;

  const JD = Math.floor(365.25 * (year + 4716)) +
             Math.floor(30.6001 * (month + 1)) +
             dayFraction + B - 1524.5;

  return JD;
}

/**
 * 計算均時差（分鐘）
 * 使用 Jean Meeus 的簡化算法
 *
 * @param year 年份
 * @param month 月份 (1-12)
 * @param day 日期
 * @returns 均時差（分鐘）。負值表示真太陽時比平太陽時慢
 */
export function calculateEquationOfTime(
  year: number,
  month: number,
  day: number
): number {
  // 計算儒略日
  const JD = calculateJulianDay(year, month, day, 12, 0, 0); // 使用正午

  // 計算儒略世紀數 (從 J2000.0 開始)
  const T = (JD - 2451545.0) / 36525.0;

  // 計算太陽的平近點角 (Mean Anomaly) - 單位：度
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const M_rad = M * Math.PI / 180;

  // 計算太陽的平黃經 (Mean Longitude) - 單位：度
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;

  // 將 L0 規範化到 0-360 度
  const L0_normalized = ((L0 % 360) + 360) % 360;

  // 地球軌道離心率
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

  // 黃道傾角 (Obliquity of the Ecliptic) - 單位：度
  const epsilon = 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  const epsilon_rad = epsilon * Math.PI / 180;

  // 計算均時差（使用簡化公式）
  // EoT = 4 * (L0 - 0.0057183 - α + Δψ * cos(ε))
  // 其中 α 是太陽的赤經

  // 計算太陽的赤經（簡化計算）
  const y = Math.tan(epsilon_rad / 2) ** 2;

  // 均時差（分鐘）
  const EoT = 4 * (
    y * Math.sin(2 * L0_normalized * Math.PI / 180) -
    2 * e * Math.sin(M_rad) +
    4 * e * y * Math.sin(M_rad) * Math.cos(2 * L0_normalized * Math.PI / 180) -
    0.5 * y * y * Math.sin(4 * L0_normalized * Math.PI / 180) -
    1.25 * e * e * Math.sin(2 * M_rad)
  ) * (180 / Math.PI);

  return EoT;
}

/**
 * 格式化均時差為可讀字串
 * @param eot 均時差（分鐘）
 * @returns 格式化字串
 */
export function formatEquationOfTime(eot: number): string {
  const absEot = Math.abs(eot);
  const minutes = Math.floor(absEot);
  const seconds = Math.round((absEot - minutes) * 60);

  const sign = eot >= 0 ? '+' : '-';
  return `${sign}${minutes}分${seconds}秒`;
}
