'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Language } from '@/lib/constants'
import Image from 'next/image'

export function ExternalLinkRedirect({ lang }: { lang: Language }) {
    const searchParams = useSearchParams()
    const url = searchParams.get('url')
    const [dict, setDict] = useState<any>(null)

    useEffect(() => {
        getDictionary(lang)
            .then(result => {
                setDict(result)
            })
            .catch(error => {
                console.error('Error loading dictionary:', error)
            })
    }, [lang])

    if (!dict || !url) {
        return null
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 border border-neutral-100">
                {/* 图标和标题区域 */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32 mb-6">
                        <Image
                            src="/Warning-pana.svg"
                            alt="Warning"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-800">
                        {dict.external.leaving}
                    </h1>
                </div>

                {/* 警告文本 */}
                <p className="text-neutral-600 text-center mb-8">
                    {dict.external.warning}
                </p>

                {/* 目标链接 */}
                <div className="bg-neutral-50 rounded-xl p-4 mb-8 border border-neutral-100">
                    <span className="block text-sm font-medium text-neutral-500 mb-1">
                        {dict.external.destination}
                    </span>
                    <div className="text-neutral-800 break-all font-medium">
                        {url.length > 300 ? `${url.substring(0, 300)}...` : url}
                    </div>
                </div>

                {/* 按钮区域 */}
                <div className="flex justify-center">
                    <button 
                        onClick={() => window.location.href = url}
                        className="w-full px-4 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all"
                    >
                        {dict.external.continue}
                    </button>
                </div>
            </div>
        </div>
    )
} 