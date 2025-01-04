import Link from 'next/link'
import { Language } from '@/lib/constants'
import { LanguageSwitcher } from './LanguageSwitcher'

interface NavBarProps {
    lang: Language;
    dict: any;
    showHistoryLink?: boolean;
    isHistoryPage?: boolean;
}

export function NavBar({ lang, dict, showHistoryLink = true, isHistoryPage = false }: NavBarProps) {
    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-4">
                <div className="h-14 flex items-center justify-between">
                    <h1 className="flex items-center gap-4">
                        <Link href={`/${lang}`} className="text-xl font-bold text-[#bb1919] font-serif">
                            {dict.title}
                        </Link>
                        {showHistoryLink && (
                            <>
                                <span className="text-neutral-500">|</span>
                                <Link
                                    href={`/${lang}/history`}
                                    className={`${isHistoryPage
                                        ? 'text-neutral-900'
                                        : 'text-neutral-600 hover:text-[#bb1919]'} transition-colors`}
                                >
                                    {dict.history.title}
                                </Link>
                            </>
                        )}
                    </h1>
                    <LanguageSwitcher currentLang={lang} />
                </div>
            </div>
        </nav>
    )
} 