import { getDictionary } from '@/lib/i18n/dictionaries'
import { Metadata } from 'next'
import { Language } from '@/lib/constants'
import { Noto_Sans, Noto_Serif } from 'next/font/google'
import Footer from './components/Footer'
import { NavBar } from './components/NavBar'
import Script from 'next/script'

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
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${resolvedParams.lang}/news`,
            title: dictionary.metadata.title,
            description: dictionary.metadata.ogDescription,
            siteName: dictionary.title,
            locale: resolvedParams.lang === 'zh' ? 'zh_CN' : 'en_US',
            type: 'website',
        },
        alternates: {
            languages: {
                'en': `${process.env.NEXT_PUBLIC_BASE_URL}/en/news`,
                'zh': `${process.env.NEXT_PUBLIC_BASE_URL}/zh/news`,
                'x-default': `${process.env.NEXT_PUBLIC_BASE_URL}/en/news`
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
  


interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

export default async function Layout({
  children,
  params
}: LayoutProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Language);
  
  return (
    <html lang={lang} className={`${notoSans.className} ${notoSerif.className}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXJ2BZJED6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXJ2BZJED6');
          `}
        </Script>
      </head>
      <body className="bg-white text-neutral-900 antialiased">
        <NavBar 
          lang={lang as Language}
          dict={dict}
        />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 