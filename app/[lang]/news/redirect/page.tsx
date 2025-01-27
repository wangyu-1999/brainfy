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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    return {
        title: dict.external.leaving,
        description: dict.external.warning,
        metadataBase: new URL(baseUrl),
        alternates: {
          canonical: `/${lang}/news/redirect`,
        }
    }
}

export default async function RedirectPage(props: PageProps) {
    const { lang } = await props.params
    return <ExternalLinkRedirect lang={lang} />
}
