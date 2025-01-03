import { Language } from '@/lib/constants'

export function LanguageSwitcher({ currentLang }: { currentLang: Language }) {
    const targetLang = currentLang === 'zh' ? 'en' : 'zh';

    return (
        <a
            href={`/${targetLang}`}
            className="px-3 py-1 rounded border border-neutral-200 hover:border-[#bb1919]"
        >
            {currentLang === 'zh' ? 'English' : '中文'}
        </a>
    );
} 