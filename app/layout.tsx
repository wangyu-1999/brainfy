import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans, Noto_Serif } from 'next/font/google'
import { Language } from '../lib/constants'
import Script from 'next/script'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['700'],
})

export const metadata: Metadata = {
  title: '新闻聚合',
  description: 'AI powered news aggregator',
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Language }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params;

  return (
    <html lang={lang} className={`${notoSans.className} ${notoSerif.className}`}>
      <head />
      <body className="bg-white text-neutral-900 antialiased">
        {children}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="2j5pwkpVXwE2om1N3SjSDA"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
