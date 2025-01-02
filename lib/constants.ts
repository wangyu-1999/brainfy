export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number]; 