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
        <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-4">
                <div className="h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href={`/${lang}/news`} className="text-xl font-bold text-[#bb1919] font-serif hover:opacity-90 transition-opacity">
                            {dict.title}
                        </Link>
                        {showHistoryLink && (
                            <div className="flex items-center gap-6">
                                <Link
                                    href={`/${lang}/news/history`}
                                    className={`${isHistoryPage
                                        ? 'text-neutral-900 font-medium'
                                        : 'text-neutral-600 hover:text-[#bb1919]'} transition-colors py-2`}
                                >
                                    {dict.history.title}
                                </Link>
                            </div>
                        )}
                    </div>
                    <LanguageSwitcher currentLang={lang} />
                </div>
            </div>
        </nav>
    )
} 