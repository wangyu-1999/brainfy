import { Noto_Sans, Noto_Serif } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['700'],
})


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${notoSans.className} ${notoSerif.className}`}>
      <head>
        <Script
            src="https://nalytics.ahrefs.com/analytics.js"
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