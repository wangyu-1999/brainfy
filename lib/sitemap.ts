import { NextResponse } from 'next/server'
import { getWeeklyNews, getWeeklyNewsFiles } from "@/lib/githubService"
import { getAllPosts } from './posts'

export async function generateUrlsetXML() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const currentDate = new Date().toISOString()

    // 获取所有周报文件
    const weeklyFiles = await getWeeklyNewsFiles()

    const weeklyUrls = await Promise.all(weeklyFiles.map(async filename => {
        const [year, week] = filename.split('-')
        const displayWeek = String(Number(week) + 1)
        const urlPath = `${year}-${displayWeek}`

        // 获取该周的数据
        const weekData = await getWeeklyNews(filename)
        if (!weekData) return ''

        // 只返回周报页面的 URL
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
    }))

    // 获取所有文章
    const posts = await getAllPosts()

    const postUrls = posts.flatMap((post: { id: string, language: string }) => {
        // 移除中文文章 ID 中的 _zh 后缀
        const postId = post.language === 'zh' ? post.id.replace('_zh', '') : post.id
        return `
    <url>
        <priority>0.8</priority>
        <loc>${baseUrl}/${post.language}/posts/${postId}</loc>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/posts/${postId}"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/posts/${postId}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/posts/${postId}"/>
    </url>`
    })

    const postIndexUrls = `
    <url>
        <priority>1.0</priority>
        <loc>${baseUrl}/en/posts</loc>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/posts"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/posts"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/posts"/>
    </url>
    <url>
        <priority>1.0</priority>
        <loc>${baseUrl}/zh/posts</loc>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/posts"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/posts"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/posts"/>
    </url>`

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>${baseUrl}/en/news</loc>
        <priority>1.0</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/news</loc>
        <priority>1.0</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news"/>
    </url>
    <url>
        <loc>${baseUrl}/en/news/history</loc>
        <priority>0.7</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news/history"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news/history"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news/history"/>
    </url>
    <url>
        <loc>${baseUrl}/zh/news/history</loc>
        <priority>0.7</priority>
        <lastmod>${currentDate}</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/news/history"/>
        <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/news/history"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/news/history"/>
    </url>
    ${weeklyUrls.join('\n')}
    ${postIndexUrls}
    ${postUrls.join('\n')}
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
                'X-Robots-Tag': 'noindex, follow'
            }
        })
    }
}