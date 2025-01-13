'use client'

import Link from 'next/link'
import { Language } from '@/lib/constants'
import { LanguageSwitcher } from './LanguageSwitcher'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavBarProps {
    lang: Language;
    dict: any;
}

export function NavBar({ lang, dict }: NavBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()
    const isHistoryPage = pathname.includes('/history')
    const isPostsPage = pathname.includes('/posts')
    const showNavLinks = !pathname.includes('/redirect')

    return (
        <nav className="sticky top-0 z-50 bg-white/95 border-b border-neutral-200 shadow-sm backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="h-16 flex items-center">
                    <div className="flex items-center gap-10 flex-1">
                        <Link href={`/${lang}/news`} className="text-xl font-bold text-[#bb1919] font-serif hover:opacity-80 transition-all duration-200">
                            {dict.title}
                        </Link>

                        {/* Desktop Navigation */}
                        {showNavLinks && (
                            <div className="hidden md:flex items-center space-x-10">
                                <Link
                                    href={`/${lang}/news/history`}
                                    className={`relative px-1 py-5 text-sm font-medium tracking-wide
                                        ${isHistoryPage
                                            ? 'text-neutral-900'
                                            : 'text-neutral-600'
                                        }
                                        hover:text-neutral-900 transition-colors duration-200
                                        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full 
                                        after:bg-[#bb1919] after:transition-transform after:duration-200
                                        ${isHistoryPage
                                            ? 'after:scale-x-100'
                                            : 'after:scale-x-0'
                                        }
                                        hover:after:scale-x-100 after:origin-left`}
                                >
                                    {dict.history.title}
                                </Link>
                                <Link
                                    href={`/${lang}/posts`}
                                    className={`relative px-1 py-5 text-sm font-medium tracking-wide
                                        ${isPostsPage
                                            ? 'text-neutral-900'
                                            : 'text-neutral-600'
                                        }
                                        hover:text-neutral-900 transition-colors duration-200
                                        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full 
                                        after:bg-[#bb1919] after:transition-transform after:duration-200
                                        ${isPostsPage
                                            ? 'after:scale-x-100'
                                            : 'after:scale-x-0'
                                        }
                                        hover:after:scale-x-100 after:origin-left`}
                                >
                                    {dict.commentary.title}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher currentLang={lang} />
                        
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-neutral-600 hover:text-[#bb1919]"
                        >
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && showNavLinks && (
                    <div className="md:hidden py-4 border-t border-neutral-200">
                        <div className="flex flex-col gap-4">
                            <Link
                                href={`/${lang}/news/history`}
                                className={`${isHistoryPage
                                    ? 'text-neutral-900 font-medium'
                                    : 'text-neutral-600'
                                    } hover:text-[#bb1919] px-2 py-2`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {dict.history.title}
                            </Link>
                            <Link
                                href={`/${lang}/posts`}
                                className={`${isPostsPage
                                    ? 'text-neutral-900 font-medium'
                                    : 'text-neutral-600'
                                    } hover:text-[#bb1919] px-2 py-2`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {dict.commentary.title}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
} 