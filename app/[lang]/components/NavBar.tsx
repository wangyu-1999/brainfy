'use client'

import Link from 'next/link'
import { Language } from '@/lib/constants'
import { LanguageSwitcher } from './LanguageSwitcher'
import { usePathname } from 'next/navigation'

interface NavBarProps {
    lang: Language;
    dict: any;
}

export function NavBar({ lang, dict }: NavBarProps) {
    const pathname = usePathname()
    const isHistoryPage = pathname.includes('/history')
    const showHistoryLink = !pathname.includes('/redirect')

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-4">
                <div className="h-14 flex items-center justify-between">
                    <h1 className="flex items-center gap-4">
                        <Link href={`/${lang}/news`} className="text-xl font-bold text-[#bb1919] font-serif">
                            {dict.title}
                        </Link>
                        {showHistoryLink && (
                            <>
                                <span className="text-neutral-500">|</span>
                                <Link
                                    href={`/${lang}/news/history`}
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