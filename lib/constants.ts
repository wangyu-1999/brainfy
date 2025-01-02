export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];

// 6小时的秒数 (6 * 3600 = 21600)
export const REVALIDATE_TIME_HOURS = 6
export const REVALIDATE_TIME = REVALIDATE_TIME_HOURS * 3600