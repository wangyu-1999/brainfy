'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface ClientUrlContentProps {
    dict: {
        external: {
            destination: string
            continue: string
            backToHome: string
        }
    }
    lang: string
}

export function ClientUrlContent({ dict, lang }: ClientUrlContentProps) {
    const searchParams = useSearchParams()
    const url = searchParams.get('url')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''

    if (!url) {
        return null
    }

    return (
        <div className="space-y-6">
            {/* URL Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4">
                    <div className="text-neutral-800 break-all font-medium text-sm">
                        {url.length > 300 ? `${url.substring(0, 300)}...` : url}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Link
                    href={`${baseUrl}/${lang}/news`}
                    className="flex-1 px-5 py-3 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-xl transition-colors text-center text-sm font-medium"
                >
                    {dict.external.backToHome}
                </Link>
                <button 
                    onClick={() => window.location.href = url}
                    className="flex-1 px-5 py-3 bg-[#bb1919] text-white rounded-xl hover:bg-[#a31717] transition-colors font-medium text-sm"
                >
                    {dict.external.continue}
                </button>
            </div>
        </div>
    )
} 