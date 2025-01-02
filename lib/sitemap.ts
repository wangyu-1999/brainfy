import { REVALIDATE_TIME_HOURS } from '@/lib/constants'
import { NextResponse } from 'next/server'

export function generateUrlsetXML() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://www.brainfy.top/en</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>1.0</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://www.brainfy.top/en"/>
        <xhtml:link rel="alternate" hreflang="zh" href="https://www.brainfy.top/zh"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="https://www.brainfy.top/en"/>
    </url>
    <url>
        <loc>https://www.brainfy.top/zh</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>1.0</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://www.brainfy.top/en"/>
        <xhtml:link rel="alternate" hreflang="zh" href="https://www.brainfy.top/zh"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="https://www.brainfy.top/en"/>
    </url>
</urlset>`
}

export function generateSitemapIndexXML() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>https://www.brainfy.top/sitemap.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
</sitemapindex>`
}

export function handleSitemapRequest(isSitemapIndex: boolean) {
    return async function () {
        const xml = isSitemapIndex ? generateSitemapIndexXML() : generateUrlsetXML()
        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': `public, max-age=${REVALIDATE_TIME_HOURS * 3600}, s-maxage=${REVALIDATE_TIME_HOURS * 3600}`
            }
        })
    }
}