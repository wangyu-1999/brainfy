import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SUPPORTED_LANGUAGES } from './lib/constants'

export function middleware(request: NextRequest) {
    // 获取当前路径
    const { pathname } = request.nextUrl

    // 如果路径已经包含语言前缀，直接放行
    if (SUPPORTED_LANGUAGES.some(locale => pathname.startsWith(`/${locale}`))) {
        // 验证历史页面的日期格式 - 只允许完整的时间戳格式
        const historyDateMatch = pathname.match(/^\/[a-z]{2}\/history\/(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})$/)
        if (pathname.includes('/history/')) {
            // 如果是 history 路径但不匹配完整格式，重定向到 404
            if (!historyDateMatch) {
                return NextResponse.redirect(new URL('/404', request.url))
            }
            // 验证日期格式是否有效
            const dateStr = historyDateMatch[1]
            const isValidDate = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])-(?:[01]\d|2[0-3])-[0-5]\d-[0-5]\d$/.test(dateStr)
            if (!isValidDate) {
                return NextResponse.redirect(new URL('/404', request.url))
            }
        }
        return NextResponse.next()
    }

    // 获取用户的语言偏好
    const acceptLanguage = request.headers.get('accept-language') || ''
    let preferredLang = 'en' // 默认英语

    // 检查是否包含中文
    if (acceptLanguage.includes('zh')) {
        preferredLang = 'zh'
    }

    // 如果是根路径，重定向到对应语言版本
    if (pathname === '/') {
        return NextResponse.redirect(new URL(`/${preferredLang}`, request.url))
    }

    // 其他路径，添加默认语言前缀
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url))
}

// 配置中间件匹配的路径
export const config = {
    matcher: [
        // 匹配所有路径，但排除以下情况
        '/((?!api|_next/static|_next/image|favicon.ico|404.svg|.*\\..*).*)'
    ]
} 