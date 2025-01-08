'use client'

import { useSearchParams } from 'next/navigation'

interface ClientUrlContentProps {
    dict: {
        external: {
            destination: string
            continue: string
        }
    }
}

export function ClientUrlContent({ dict }: ClientUrlContentProps) {
    const searchParams = useSearchParams()
    const url = searchParams.get('url')

    if (!url) {
        return null
    }

    return (
        <>
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
        </>
    )
} 