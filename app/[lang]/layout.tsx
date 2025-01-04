import { getDictionary } from '@/lib/i18n/dictionaries'
import { Metadata } from 'next'
import { Language } from '@/lib/constants'
// 生成 metadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>,
}): Promise<Metadata> {
    const resolvedParams = await params
    const dictionary = await getDictionary(resolvedParams.lang as Language)
    
    return {
        title: {
            default: dictionary.metadata.title,
            template: `%s | ${dictionary.title}`
        },
        description: dictionary.metadata.description,
        openGraph: {
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og/brainfy_banner.png`,
                    width: 1200,
                    height: 630,
                    alt: dictionary.metadata.title
                }
            ],
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${resolvedParams.lang}`,
            title: dictionary.metadata.title,
            description: dictionary.metadata.ogDescription,
            siteName: dictionary.title,
            locale: resolvedParams.lang === 'zh' ? 'zh_CN' : 'en_US',
            type: 'website',
        },
        alternates: {
            languages: {
                'en': `${process.env.NEXT_PUBLIC_BASE_URL}/en`,
                'zh': `${process.env.NEXT_PUBLIC_BASE_URL}/zh`,
                'x-default': `${process.env.NEXT_PUBLIC_BASE_URL}/en`
            }
        },
        robots: {
            index: true,
            follow: true
        }
    }
}


export default async function Layout({
    children,
}: {
    children: React.ReactNode,
}) {
    return children
} 