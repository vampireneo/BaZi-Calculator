/**
 * 城市資料定義
 * 包含 IANA 時區識別符以支援 DST 自動處理
 */

export interface City {
  name: string;
  key: string;
  longitude: number; // 東經為正，西經為負
  iana: string;      // IANA Timezone Identifier
}

export const CITIES: City[] = [
  { name: "台北 (Taipei)", key: "TPE", longitude: 121.56, iana: "Asia/Taipei" },
  { name: "香港 (Hong Kong)", key: "HKG", longitude: 114.17, iana: "Asia/Hong_Kong" },
  { name: "北京 (Beijing)", key: "PEK", longitude: 116.40, iana: "Asia/Shanghai" }, // 北京使用中國標準時間
  { name: "東京 (Tokyo)", key: "TYO", longitude: 139.69, iana: "Asia/Tokyo" },
  { name: "新加坡 (Singapore)", key: "SIN", longitude: 103.81, iana: "Asia/Singapore" },
  { name: "雪梨 (Sydney)", key: "SYD", longitude: 151.20, iana: "Australia/Sydney" },
  { name: "倫敦 (London)", key: "LHR", longitude: -0.12, iana: "Europe/London" },
  { name: "紐約 (New York)", key: "NYC", longitude: -74.00, iana: "America/New_York" },
  { name: "洛杉磯 (Los Angeles)", key: "LAX", longitude: -118.24, iana: "America/Los_Angeles" },
  { name: "巴黎 (Paris)", key: "CDG", longitude: 2.35, iana: "Europe/Paris" },
];

/**
 * 根據城市 key 獲取城市資料
 */
export function getCityByKey(key: string): City | undefined {
  return CITIES.find(city => city.key === key);
}

/**
 * 獲取預設城市（台北）
 */
export function getDefaultCity(): City {
  return CITIES[0];
}
