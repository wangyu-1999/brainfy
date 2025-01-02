import { Noto_Sans, Noto_Serif } from 'next/font/google'
import Script from 'next/script'

const notoSans = Noto_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

const notoSerif = Noto_Serif({
    subsets: ['latin'],
    weight: ['700'],
})

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params

    return (
        <html lang={lang} className={`${notoSans.className} ${notoSerif.className}`}>
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