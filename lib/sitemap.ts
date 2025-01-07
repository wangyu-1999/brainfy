import { REVALIDATE_TIME_HOURS } from '@/lib/constants'
import { NextResponse } from 'next/server'
import { getAllNewsWithoutContent } from '@/app/[lang]/utils/getLatestNews'
import { formatUrlDate } from '@/app/[lang]/utils/formatDate'

export async function generateUrlsetXML() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const currentDate = new Date().toISOString()

    // 获取所有历史新闻数据
    const allNews = await getAllNewsWithoutContent()

    // 生成历史页面的 URL
    const historyUrls = allNews.map(group => {
        const date = formatUrlDate(group.date)
        return `
    <url>
        <loc>${baseUrl}/en/history/${date}</loc>
        <priority>0.8</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/history/${date}"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/history/${date}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/history/${date}"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/history/${date}</loc>
        <priority>0.8</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/history/${date}"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/history/${date}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/history/${date}"/>
    </url>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>${baseUrl}/en</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>1.0</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en"/>
    </url>
    <url>
        <loc>${baseUrl}/zh</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>1.0</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en"/>
    </url>
    <url>
        <loc>${baseUrl}/en/history</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>0.7</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/history"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/history"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/history"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/history</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>0.7</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/history"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/history"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/history"/>
    </url>
    <url>
        <loc>${baseUrl}/en/redirect</loc>
        <priority>0.1</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/redirect"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/redirect"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/redirect"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/redirect</loc>
        <priority>0.1</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/redirect"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/redirect"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/redirect"/>
    </url>${historyUrls}
</urlset>`
}

export function generateSitemapIndexXML() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${baseUrl}/sitemap.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
</sitemapindex>`
}

export function handleSitemapRequest(isSitemapIndex: boolean) {
    return async function () {
        const xml = isSitemapIndex ? generateSitemapIndexXML() : await generateUrlsetXML()
        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': `public, max-age=${REVALIDATE_TIME_HOURS * 3600}, s-maxage=${REVALIDATE_TIME_HOURS * 3600}`,
                'X-Robots-Tag': 'noindex, follow'
            }
        })
    }
}