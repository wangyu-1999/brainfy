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