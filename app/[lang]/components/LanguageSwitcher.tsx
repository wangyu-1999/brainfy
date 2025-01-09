'use client'

import { Language } from '@/lib/constants'
import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher({ currentLang }: { currentLang: Language }) {
    const router = useRouter()
    const pathname = usePathname()
    const targetLang = currentLang === 'zh' ? 'en' : 'zh'

    const handleLanguageSwitch = () => {
        // 替换路径中的语言部分
        const targetPath = pathname.replace(`/${currentLang}`, `/${targetLang}`)
        // 保留当前的 search 参数和 hash
        const search = window.location.search
        const hash = window.location.hash
        router.push(`${targetPath}${search}${hash}`)
    }

    return (
        <button
            onClick={handleLanguageSwitch}
            className="px-3 py-1 rounded border border-neutral-200 hover:border-[#bb1919]"
        >
            {currentLang === 'zh' ? 'English' : '中文'}
        </button>
    );
} 