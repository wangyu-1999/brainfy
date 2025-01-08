import Image from 'next/image'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Language } from '@/lib/constants'
import { ClientUrlContent } from '../components/ClientUrlContent'

export async function ExternalLinkRedirect({ lang }: { lang: Language }) {
    const dict = await getDictionary(lang)

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

                {/* 客户端组件处理 URL 相关内容 */}
                <ClientUrlContent dict={dict} />
            </div>
        </div>
    )
} 