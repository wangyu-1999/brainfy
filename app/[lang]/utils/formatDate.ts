import { getDictionary } from '@/lib/i18n/dictionaries'


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

// 新增历史记录专用的时间格式化函数
export function formatHistoryDate(dateString: string) {
    return new Date(dateString).toLocaleString(
        'en-US', // 使用英文格式确保统一性
        {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        }
    ).replace(/\//g, '-') + ' UTC';
}

// 专门处理 URL 格式日期 (2025-01-04-14-00-38)
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