export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];

// 12小时的秒数 (12 * 3600 = 43200)
export const REVALIDATE_TIME_HOURS = 12
export const REVALIDATE_TIME = REVALIDATE_TIME_HOURS * 3600