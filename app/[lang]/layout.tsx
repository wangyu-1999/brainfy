import { Noto_Sans, Noto_Serif } from 'next/font/google'
import Script from 'next/script'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Metadata } from 'next'
import { Language } from '@/lib/constants'

const notoSans = Noto_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

const notoSerif = Noto_Serif({
    subsets: ['latin'],
    weight: ['700'],
})

// 生成 metadata
export async function generateMetadata({
    params
}: {
    params: Promise<{ lang: string }>
}): Promise<Metadata> {
    // 先 await params
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
                    url: 'https://www.brainfy.top/images/og/brainfy_banner.png',
                    width: 1200,
                    height: 630,
                    alt: dictionary.metadata.title
                }
            ],
            title: dictionary.metadata.title,
            description: dictionary.metadata.ogDescription,
            url: 'https://www.brainfy.top',
            siteName: dictionary.title,
            locale: resolvedParams.lang === 'zh' ? 'zh_CN' : 'en_US',
            type: 'website',
        },
        alternates: {
            languages: {
                'en': '/en',
                'zh': '/zh',
                'x-default': '/en'
            }
        },
        robots: {
            index: true,
            follow: true
        }
    }
}

export const viewport = {
    width: 'device-width',
    initialScale: 1
}

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const resolvedParams = await params

    return (
        <html lang={resolvedParams.lang} className={`${notoSans.className} ${notoSerif.className}`}>
            <head>
                <Script
                    src="https://analytics.ahrefs.com/analytics.js"
                    data-key="2j5pwkpVXwE2om1N3SjSDA"
                    strategy="afterInteractive"
                />
            </head>
            <body className="bg-white text-neutral-900 antialiased">
                {children}
            </body>
        </html>
    )
} 