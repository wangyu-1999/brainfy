import './globals.css'
import type { Metadata } from 'next'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}