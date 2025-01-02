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
  title: {
    default: 'Brainfy',
    template: '%s | Brainfy'
  },
  description: 'Brainfy - AI驱动的智能信息聚合平台 | AI-powered intelligent content aggregator',
  alternates: {
    languages: {
      'en': '/en',
      'zh': '/zh',
      'x-default': '/en'
    }
  }
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Language }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params;

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
