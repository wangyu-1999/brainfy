import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { getWeeklyNews } from "@/lib/githubService"
import Link from 'next/link'
import { FloatingToc, TocItem } from '../../../components/FloatingToc'
import { ArticleMain } from '../../../components/ArticleMain'
import { getAllNewsWithoutContent } from '@/app/[lang]/utils/getLatestNews'
import { formatUrlDate, formatNewsDate } from '../../../utils/formatDate'

type PageProps = {
    params: Promise<{ lang: Language; week: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { lang, week } = await params;
    const dict = await getDictionary(lang);
    const weekNumber = Number(week.split('-')[1]);
    const year = week.split('-')[0];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    // 获取实际的周数（因为URL中的周数需要-1）
    const actualWeek = `${year}-${String(Number(weekNumber) - 1)}`;
    const weeklyNews = await getWeeklyNews(actualWeek);
    
    // 获取前三条新闻标题并限制在100字符以内
    const headlines = (weeklyNews?.articles
        .slice(0, 3)
        .map((article: { content: { title_cn: string; title_en: string } }) => 
            lang === 'zh' ? article.content.title_cn : article.content.title_en)
        .join('; ') || '').slice(0, 100);

    const title = dict.weekly.weekNumber
        .replace('%week%', String(weekNumber))
        .replace('%year%', year);

    const description = dict.weekly.description
        .replace('%week%', String(weekNumber))
        .replace('%year%', year)
        .replace('%headlines%', headlines);

    return {
        title: `${title} - ${dict.weekly.pageTitle}`,
        description,
        metadataBase: new URL(baseUrl || 'http://localhost:3000'),
        alternates: {
            canonical: `/${lang}/news/weekly/${week}`,
            languages: {
                'en': `${baseUrl}/en/news/weekly/${week}`,
                'zh': `${baseUrl}/zh/news/weekly/${week}`,
                'x-default': `${baseUrl}/en/news/weekly/${week}`
            }
        },
        openGraph: {
            url: `${baseUrl}/${lang}/news/weekly/${week}`,
        }
    }
}

export default async function WeeklyNewsPage({ params }: PageProps) {
    const { lang, week } = await params;
    const dict = await getDictionary(lang);
    const actualWeek = `${week.split('-')[0]}-${String(Number(week.split('-')[1]) - 1)}`;
    const weeklyNews = await getWeeklyNews(actualWeek);
    const weekNumber = Number(week.split('-')[1]);

    if (!weeklyNews) {
        return (
            <main className="min-h-screen bg-neutral-100">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-center py-10">{dict.noData}</div>
                </div>
            </main>
        );
    }

    const tocItems: TocItem[] = weeklyNews.articles.map((article: { content: { title_cn: string; title_en: string } }, index: number) => ({
        id: `article-${index}`,
        title: lang === 'zh' ? article.content.title_cn : article.content.title_en
    }));

    // 获取该周对应的所有新闻时间点
    const allNews = await getAllNewsWithoutContent();
    const dateLinks = allNews
        .filter(news => {
            const newsDate = new Date(news.date.split('_')[0]);
            return newsDate >= new Date(weeklyNews.date_range.earliest) && 
                   newsDate <= new Date(weeklyNews.date_range.latest);
        })
        .map(news => {
            const routeDate = formatUrlDate(news.date);
            return {
                originalDate: news.date,  // 保存原始日期字符串
                routeDate: routeDate
            };
        })
        .sort((a, b) => {
            const dateA = new Date(a.originalDate.split('_')[0]);
            const dateB = new Date(b.originalDate.split('_')[0]);
            return dateB.getTime() - dateA.getTime();
        });

    return (
        <main className="min-h-screen bg-neutral-100">
            <div className="max-w-4xl mx-auto px-4 py-6 relative">
                <div className="mb-6">
                    <Link
                        href={`/${lang}/news/history`}
                        className="flex items-center gap-1.5 text-neutral-600 hover:text-[#bb1919] transition-colors text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span>{dict.history.backToArchives}</span>
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-xl text-neutral-700 font-medium mb-2">
                        {dict.weekly.weekNumber
                            .replace('%week%', String(weekNumber))
                            .replace('%year%', week.split('-')[0])}
                    </h1>
                    <div className="text-sm text-neutral-600 mb-4">
                        {new Date(weeklyNews.date_range.earliest).toLocaleDateString()} - {new Date(weeklyNews.date_range.latest).toLocaleDateString()}
                    </div>
                    
                    {/* 顶部日期导航区域 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-neutral-600 mb-3">
                            <span className="inline-flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {dict.weekly.dailyNewsHint}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {dateLinks.map(({ originalDate, routeDate }) => (
                                <Link
                                    key={routeDate}
                                    href={`/${lang}/news/history/${routeDate}`}
                                    className="text-sm px-3 py-1 bg-neutral-50 rounded-full shadow-sm hover:shadow-md transition-shadow text-neutral-600 hover:text-[#bb1919]"
                                >
                                    {formatNewsDate(originalDate, lang)}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <FloatingToc items={tocItems} lang={lang} />

                {weeklyNews.articles.map((article: { url: string, content: any }, index: number) => (
                    <section
                        key={article.url}
                        id={`article-${index}`}
                        className="mb-12 bg-white shadow-sm rounded-sm overflow-hidden scroll-mt-20"
                    >
                        <ArticleMain
                            content={article.content}
                            url={article.url}
                            lang={lang}
                            useRelativeTime={false}
                        />
                    </section>
                ))}

                {/* 底部日期导航区域 */}
                <div className="mt-12 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-1.5 text-lg text-neutral-700 font-medium mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            {dict.weekly.dailyNewsTitle}
                        </div>
                        <div className="text-sm text-neutral-600 mb-3">
                            {dict.weekly.dailyNewsDescription}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {dateLinks.map(({ originalDate, routeDate }) => (
                                <Link
                                    key={routeDate}
                                    href={`/${lang}/news/history/${routeDate}`}
                                    className="text-sm px-3 py-1 bg-neutral-50 rounded-full shadow-sm hover:shadow-md transition-shadow text-neutral-600 hover:text-[#bb1919]"
                                >
                                    {formatNewsDate(originalDate, lang)}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 