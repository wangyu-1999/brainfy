import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SUPPORTED_LANGUAGES } from './lib/constants'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 获取用户的语言偏好
    const acceptLanguage = request.headers.get('accept-language') || ''
    let preferredLang = 'en' // 默认英语

    // 检查是否包含中文
    if (acceptLanguage.includes('zh')) {
        preferredLang = 'zh'
    }

    // 如果是根路径或仅语言路径，重定向到对应语言的news页面
    if (pathname === '/' || pathname === '/en' || pathname === '/zh') {
        // 如果是仅语言路径，使用当前路径的语言而不是 preferredLang
        const lang = pathname === '/' ? preferredLang : pathname.slice(1)
        return NextResponse.redirect(new URL(`/${lang}/news`, request.url), {
            status: 301
        })
    }

    // 如果路径已经包含语言前缀，直接放行
    if (SUPPORTED_LANGUAGES.some(locale => 
        pathname.startsWith(`/${locale}/`) || // 注意这里添加了斜杠
        pathname.startsWith(`/${locale}/news/`)
    )) {
        // 验证历史页面的日期格式检查...
        const historyDateMatch = pathname.match(/^\/[a-z]{2}\/news\/history\/(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})$/)
        if (pathname.includes('/news/history/')) {
            if (!historyDateMatch) {
                return NextResponse.redirect(new URL('/404', request.url))
            }
            const dateStr = historyDateMatch[1]
            const isValidDate = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])-(?:[01]\d|2[0-3])-[0-5]\d-[0-5]\d$/.test(dateStr)
            if (!isValidDate) {
                return NextResponse.redirect(new URL('/404', request.url))
            }
        }
        return NextResponse.next()
    }

    // 其他路径，添加默认语言前缀和news路径
    return NextResponse.redirect(new URL(`/en/news${pathname}`, request.url))
}

// 配置中间件匹配的路径
export const config = {
    matcher: [
        // 匹配所有路径，但排除以下情况
        '/((?!api|_next/static|_next/image|favicon.ico|404.svg|.*\\..*).*)'
    ]
} 