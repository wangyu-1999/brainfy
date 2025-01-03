import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import Link from 'next/link'
import { getAllNewsWithoutContent } from '../utils/getLatestNews'
import { formatUrlDate } from '../utils/formatUrlDate'

type PageParams = Promise<{ lang: Language }>

export const revalidate = 43200

export async function generateMetadata({
    params
}: {
    params: PageParams
}): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return {
        title: dict.history.title,
        description: dict.history.description,
    }
}

export default async function HistoryPage({
    params,
}: {
    params: PageParams;
}) {
    const { lang } = await params;
    const allNews = await getAllNewsWithoutContent();
    const dict = await getDictionary(lang);

    // 按日期分组，并按时间倒序排列
    const groupedNews = allNews.reduce((acc, newsGroup) => {
        const date = new Date(newsGroup.date);
        const dateKey = date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push({
            date: newsGroup.date,
            clusters: { length: newsGroup.count }
        });
        return acc;
    }, {} as Record<string, any[]>);

    // 将对象转换为数组并按日期倒序排序
    const sortedEntries = Object.entries(groupedNews).sort(([dateKeyA], [dateKeyB]) => {
        const dateA = new Date(dateKeyA);
        const dateB = new Date(dateKeyB);
        return dateB.getTime() - dateA.getTime(); // 倒序排列
    });

    return (
        <main className="min-h-screen bg-neutral-100">
            <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="h-14 flex items-center justify-between">
                        <h1 className="flex items-center gap-4">
                            <Link href={`/${lang}`} className="text-xl font-bold text-[#bb1919] font-serif">
                                {dict.title}
                            </Link>
                            <span className="text-neutral-500">|</span>
                            <span className="text-lg text-neutral-900">
                                {dict.history.title}
                            </span>
                        </h1>
                        <LanguageSwitcher currentLang={lang} />
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-6">
                <p className="text-sm text-neutral-400 mb-8 italic">
                    {dict.history.intro}
                </p>

                <div className="relative">
                    {/* 时间线 */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-neutral-200" />

                    <div className="space-y-8">
                        {sortedEntries.map(([dateKey, dateGroups]) => (
                            <section key={dateKey} className="relative">
                                {/* 日期标题 */}
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border-4 border-neutral-100 relative z-10">
                                        <time className="text-sm font-medium text-neutral-600 text-center">
                                            {new Date(dateGroups[0].date).toLocaleDateString(
                                                lang === 'zh' ? 'zh-CN' : 'en-US',
                                                { month: 'short', day: 'numeric' }
                                            )}
                                        </time>
                                    </div>
                                    <h2 className="ml-6 text-xl font-medium text-neutral-900">
                                        {dateKey}
                                    </h2>
                                </div>

                                {/* 新闻列表 - 同一天的新闻也按时间倒序排列 */}
                                <div className="ml-16 space-y-2">
                                    {dateGroups
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map(group => (
                                            <Link
                                                key={group.date}
                                                href={`/${lang}/history/${formatUrlDate(group.date)}`}
                                                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
                                            >
                                                <div className="p-4 flex items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="text-base font-medium text-neutral-900 group-hover:text-[#bb1919] transition-colors">
                                                            {group.clusters.length} {lang === 'zh' ? '条新闻' : ' News Items'}
                                                        </div>
                                                    </div>
                                                    <time className="text-sm text-neutral-500 whitespace-nowrap">
                                                        {new Date(group.date).toLocaleTimeString(
                                                            lang === 'zh' ? 'zh-CN' : 'en-US',
                                                            { hour: '2-digit', minute: '2-digit' }
                                                        )}
                                                    </time>
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
} 