import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SUPPORTED_LANGUAGES } from './lib/constants'

export function middleware(request: NextRequest) {
    // 获取当前路径
    const { pathname } = request.nextUrl

    // 如果路径已经包含语言前缀，直接放行
    if (SUPPORTED_LANGUAGES.some(locale => pathname.startsWith(`/${locale}`))) {
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
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
    ]
} 