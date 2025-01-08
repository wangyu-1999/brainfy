import type { Language } from '@/lib/constants'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { ExternalLinkRedirect } from '../../components/ExternalLinkRedirect'

interface PageProps {
    params: Promise<{ lang: Language }>
}


export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { lang } = await params
    const dict = await getDictionary(lang)
    
    return {
        title: dict.external.leaving,
        description: dict.external.warning,
        robots: 'noindex, nofollow'
    }
}

export default async function RedirectPage(props: PageProps) {
    const { lang } = await props.params
    return <ExternalLinkRedirect lang={lang} />
}
