import { ExternalLinkRedirect } from '../components/ExternalLinkRedirect'
import type { Language } from '@/lib/constants'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'

// 生成动态 metadata
export async function generateMetadata({ params }: { params: { lang: Language } }): Promise<Metadata> {
    const dict = await getDictionary(params.lang)
    
    return {
        title: dict.external.leaving,
        description: dict.external.warning,
        robots: 'noindex, nofollow'
    }
}

export default function RedirectPage({ params }: { params: { lang: Language } }) {
    return <ExternalLinkRedirect lang={params.lang} />
} 