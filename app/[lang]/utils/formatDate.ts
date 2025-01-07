import { getDictionary } from '@/lib/i18n/dictionaries'

/**
 * 格式化日期为相对时间或具体时间
 * @param dateString - ISO 格式的日期字符串 (e.g., "2024-03-20T10:30:00Z")
 * @param lang - 语言选项 'zh' | 'en'
 * @returns 
 * - 今天: "今天" | "Today"
 * - 昨天: "昨天" | "Yesterday"
 * - 7天内: "x天前" | "x days ago"
 * - 其他: "MM/DD HH:mm" | "月/日 时:分"
 */
export async function formatDate(dateString: string, lang: 'zh' | 'en') {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    const dict = await getDictionary(lang);

    if (diffDays === 0) return dict.time.today;
    if (diffDays === 1) return dict.time.yesterday;
    if (diffDays < 7) return dict.time.daysAgo.replace('%d', String(diffDays));

    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}

/**
 * 格式化日期为历史记录显示格式
 * @param dateString - ISO 格式的日期字符串 (e.g., "2024-03-20T10:30:00Z")
 * @returns 格式化后的日期字符串 (e.g., "2024-03-20 10:30 UTC")
 */
export function formatHistoryDate(dateString: string, lang: 'zh' | 'en' = 'en') {

    let date: Date;
    
    // 处理两种可能的日期格式
    if (dateString.includes('_')) {
        // 处理 YYYY-MM-DD_HH-mm-ss_UTC 格式
        const match = dateString.match(/(\d{4})[_-](\d{2})[_-](\d{2})[_-](\d{2})/);
        if (match) {
            const [_, year, month, day, hour] = match;
            date = new Date(Date.UTC(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hour)
            ));
        } else {
            date = new Date(dateString);
        }
    } else {
        // 处理 ISO 格式 (YYYY-MM-DDTHH:mm:ss.sssZ)
        date = new Date(dateString);
    }

    try {
        if (lang === 'zh') {
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC'
            }) + ' UTC';
        } else {
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC'
            }) + ' UTC';
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * 将 URL 格式的日期转换为可读格式
 * @param dateString - URL 格式的日期 (e.g., "2025-01-04-14-00-38")
 * @param lang - 语言选项 'zh' | 'en'，默认为 'en'
 * @returns 本地化的日期字符串 
 * - en: "January 4, 2025 14:00"
 * - zh: "2025年1月4日 14:00"
 */
export function formatUrlDisplayDate(dateString: string, lang: 'zh' | 'en' = 'en') {
    const [year, month, day, hour, minute] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
    
    return date.toLocaleString(
        lang === 'zh' ? 'zh-CN' : 'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        }
    );
}

/**
 * 将日期字符串格式化为 URL 友好格式
 * @param dateStr - 日期字符串 (e.g., "2025-01-03 14:00:36 UTC")
 * @returns URL 友好的日期格式 (e.g., "2025-01-03-14-00-36")
 * @returns 如果输入为空则返回空字符串
 */
export function formatUrlDate(dateStr: string) {
    if (!dateStr) return '';
    
    // 只处理 YYYY-MM-DD_HH-mm-ss_UTC 格式
    if (dateStr.includes('_UTC')) {
        return dateStr.split('_UTC')[0].replace(/_/g, '-');
    }
    
    return dateStr;
} 