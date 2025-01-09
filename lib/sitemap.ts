import { REVALIDATE_TIME_HOURS } from '@/lib/constants'
import { NextResponse } from 'next/server'
import { getAllNewsWithoutContent } from '@/app/[lang]/utils/getLatestNews'
import { formatUrlDate } from '@/app/[lang]/utils/formatDate'
import { getWeeklyNewsFiles } from "@/lib/githubService"

export async function generateUrlsetXML() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const currentDate = new Date().toISOString()

    // 获取所有历史新闻数据
    const allNews = await getAllNewsWithoutContent()
    
    // 获取所有周报文件
    const weeklyFiles = await getWeeklyNewsFiles()
    
    // 生成周报页面的 URL
    const weeklyUrls = weeklyFiles.map(filename => {
        // 文件名格式为 "YYYY-WW", URL 中的周数需要 +1
        const [year, week] = filename.split('-')
        const displayWeek = String(Number(week) + 1).padStart(2, '0')
        const urlPath = `${year}-${displayWeek}`
        
        return `
    <url>
        <loc>${baseUrl}/en/news/weekly/${urlPath}</loc>
        <priority>0.8</priority>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news/weekly/${urlPath}"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news/weekly/${urlPath}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news/weekly/${urlPath}"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/news/weekly/${urlPath}</loc>
        <priority>0.8</priority>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news/weekly/${urlPath}"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news/weekly/${urlPath}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news/weekly/${urlPath}"/>
    </url>`
    }).join('\n')

    // 生成历史页面的 URL
    const historyUrls = allNews.map(group => {
        const date = formatUrlDate(group.date)
        return `
    <url>
        <loc>${baseUrl}/en/news/history/${date}</loc>
        <priority>0.8</priority>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news/history/${date}"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news/history/${date}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news/history/${date}"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/news/history/${date}</loc>
        <priority>0.8</priority>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news/history/${date}"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news/history/${date}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news/history/${date}"/>
    </url>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>${baseUrl}/en/news</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>1.0</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/news</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>1.0</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news"/>
    </url>
    <url>
        <loc>${baseUrl}/en/news/history</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>0.7</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news/history"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news/history"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news/history"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/news/history</loc>
        <changefreq>every${REVALIDATE_TIME_HOURS}hours</changefreq>
        <priority>0.7</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news/history"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news/history"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news/history"/>
    </url>
    ${weeklyUrls}
    ${historyUrls}
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