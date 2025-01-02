const dictionaries = {
    zh: () => import('./zh.json').then((module) => module.default),
    en: () => import('./en.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'zh' | 'en') => dictionaries[locale]() 