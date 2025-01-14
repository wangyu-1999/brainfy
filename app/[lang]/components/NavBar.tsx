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
    const pathname = usePathname() ?? ''
    const isHistoryPage = pathname.includes('/history')
    const isPostsPage = pathname.includes('/posts')
    const showNavLinks = !pathname.includes('/redirect')

    return (
        <nav className="sticky top-0 z-50 bg-white/95 border-b border-neutral-200 shadow-sm backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="px-4 sm:px-8 h-16 flex items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link 
                            href={`/${lang}/news`} 
                            className="text-xl font-bold text-[#bb1919] font-serif hover:opacity-80 transition-all duration-200 leading-none"
                        >
                            {dict.title}
                        </Link>

                        {/* Desktop Navigation */}
                        {showNavLinks && (
                            <div className="hidden md:flex items-center gap-6">
                                <Link
                                    href={`/${lang}/news/history`}
                                    className={`relative inline-flex items-center h-16 text-sm font-sans leading-none tracking-normal uppercase
                                        ${isHistoryPage ? 'text-neutral-900' : 'text-neutral-600'}
                                        hover:text-neutral-900 transition-colors duration-200
                                        after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 
                                        after:bg-[#bb1919] after:transition-transform after:duration-200
                                        ${isHistoryPage ? 'after:scale-x-100' : 'after:scale-x-0'}
                                        hover:after:scale-x-100 after:origin-left`}
                                >
                                    <span className="relative top-px">{dict.history.title}</span>
                                </Link>
                                <Link
                                    href={`/${lang}/posts`}
                                    className={`relative inline-flex items-center h-16 text-sm font-sans leading-none tracking-normal uppercase
                                        ${isPostsPage ? 'text-neutral-900' : 'text-neutral-600'}
                                        hover:text-neutral-900 transition-colors duration-200
                                        after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 
                                        after:bg-[#bb1919] after:transition-transform after:duration-200
                                        ${isPostsPage ? 'after:scale-x-100' : 'after:scale-x-0'}
                                        hover:after:scale-x-100 after:origin-left`}
                                >
                                    <span className="relative top-px">{dict.commentary.title}</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Language Switcher */}
                    <div className="hidden md:block ml-auto">
                        <LanguageSwitcher currentLang={lang} />
                    </div>

                    {/* Mobile Menu Button and Language Switcher */}
                    <div className="flex md:hidden items-center gap-4 ml-auto">
                        <LanguageSwitcher currentLang={lang} />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1.5 rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                            aria-label="menu_button"
                            role="button"
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
                    <div className="md:hidden border-t border-neutral-200">
                        <div className="px-4 sm:px-8 py-2 space-y-1">
                            <Link
                                href={`/${lang}/news/history`}
                                className={`block px-3 py-2 rounded-md text-base font-medium
                                    ${isHistoryPage ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600'}
                                    hover:bg-neutral-100 hover:text-neutral-900`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {dict.history.title}
                            </Link>
                            <Link
                                href={`/${lang}/posts`}
                                className={`block px-3 py-2 rounded-md text-base font-medium
                                    ${isPostsPage ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600'}
                                    hover:bg-neutral-100 hover:text-neutral-900`}
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