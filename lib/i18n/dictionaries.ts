import { Language } from '../constants'

const dictionaries = {
    zh: () => import('./zh.json').then((module) => module.default),
    en: () => import('./en.json').then((module) => module.default),
}

export const getDictionary = async (locale: Language) => dictionaries[locale]() 