import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { getAllNewsWithoutContent, getNewsByDate } from '../../../utils/getLatestNews'
import { findWeekNumber, getWeeklyNews } from "@/lib/githubService"
import { ArticleMain } from '../../../components/ArticleMain'
import { RelatedArticles } from '../../../components/RelatedArticles'
import Link from 'next/link'
import { formatHistoryDate } from '../../../utils/formatDate'
import { FloatingToc, TocItem } from '../../../components/FloatingToc'
import { slugify } from '../../../utils/slugify'
import { formatUrlDisplayDate } from '../../../utils/formatDate'
import { Article } from '@/types/news'
import { formatNewsDate } from '../../../utils/formatDate'

// 简化类型定义
type PageProps = {
    params: Promise<{ lang: Language; date: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
    const allNews = await getAllNewsWithoutContent();
    
    const uniqueDates = new Set(
        allNews.map(group => {
            const [datePart, timePart] = group.date.split('_');
            return `${datePart}-${timePart.replace(/-/g, '-').replace('_UTC', '')}`;
        })
    );
    
    return Array.from(uniqueDates).flatMap(date => [
        { lang: 'zh', date },
        { lang: 'en', date }
    ]);
}

export async function generateMetadata({ params }: PageProps) {
    const { lang, date } = await params;
    const dict = await getDictionary(lang);
    
    // 将 URL 格式转换回原始格式
    const originalDate = date.replace(/-(\d{2})-(\d{2})-(\d{2})$/, '_$1-$2-$3_UTC');
    const currentDate = new Date(originalDate.split('_')[0]);
    const year = currentDate.getFullYear();
    
    // 使用 findWeekNumber 替代遍历
    const weekNumber = await findWeekNumber(currentDate);

    // 获取新闻数据
    const allNews = await getAllNewsWithoutContent();
    const targetNews = allNews
        .map(news => news.date)
        .filter(newsDate => newsDate.startsWith(date))
        .sort()
        .pop();

    const newsGroup = targetNews ? await getNewsByDate(targetNews) : null;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const formattedDate = formatUrlDisplayDate(date, lang);

    // 提取关键新闻标题
    const mainTitles = newsGroup?.clusters
        .slice(0, 3)
        .map(cluster => {
            const title = lang === 'zh' 
                ? cluster.articles[0]?.content?.title_cn 
                : cluster.articles[0]?.content?.title_en;
            return title || '';
        })
        .filter(Boolean) || [];

    const pageDescription = mainTitles.length > 0
        ? `${dict.history.title}: ${mainTitles.join('. ')}. ${dict.history.dayDescription.replace('%date%', formattedDate)}`
        : `${dict.history.dayDescription.replace('%date%', date)}`;

    const pageTitle = `${formattedDate} - ${dict.history.title}`;

    const canonicalPath = weekNumber 
        ? `/${lang}/news/weekly/${year}-${String(weekNumber).padStart(2, '0')}`
        : `/${lang}/news/history/${date}`;
    

    return {
        title: pageTitle,
        description: pageDescription,
        metadataBase: new URL(baseUrl || 'http://localhost:3000'),
        alternates: {
            canonical: canonicalPath,
            languages: {
                'en': `${baseUrl}/en/news/history/${date}`,
                'zh': `${baseUrl}/zh/news/history/${date}`,
                'x-default': `${baseUrl}/en/news/history/${date}`
            }
        },
        openGraph: {
            url: `${baseUrl}/${lang}/news/history/${date}`,
        }
    }
}

export default async function HistoryDetailPage({ params }: PageProps) {
    const { lang, date } = await params;
    const dict = await getDictionary(lang);
    
    // 将 URL 格式转换回原始格式
    const originalDate = date.replace(/-(\d{2})-(\d{2})-(\d{2})$/, '_$1-$2-$3_UTC');
    const newsGroup = await getNewsByDate(originalDate);

    if (!newsGroup) {
        return <div>{dict.noData}</div>;
    }

    // 获取当前日期所属的周数
    const currentDate = new Date(originalDate.split('_')[0]);
    const year = currentDate.getFullYear();
    const weekNumber = await findWeekNumber(currentDate);

    const weekLink = weekNumber ? 
        `/${lang}/news/weekly/${year}-${String(weekNumber).padStart(2, '0')}` : 
        null;

    const tocItems: TocItem[] = newsGroup.clusters
        .map((cluster, index) => {
            const title = lang === 'zh' ? cluster.articles[0]?.content?.title_cn : cluster.articles[0]?.content?.title_en;
            return title ? {
                id: slugify(cluster.articles[0]?.content?.title_en || `article-${index}`),
                title
            } : null;
        })
        .filter(Boolean) as TocItem[];

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
                        {dict.history.dateHeadline.replace('%date%', formatNewsDate(originalDate, lang))}
                    </h1>
                    <time className="text-sm text-neutral-600">
                        {formatHistoryDate(originalDate, lang)}
                    </time>
                </div>

                {weekLink && (
                    <>
                        {/* 顶部周报链接 */}
                        <div className="mb-8">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="text-sm text-neutral-600 mb-3">
                                    <span className="inline-flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        {dict.weekly.weeklyNewsHint}
                                    </span>
                                </div>
                                <Link
                                    href={weekLink || ''}
                                    className="text-sm px-3 py-1 bg-neutral-50 rounded-full shadow-sm hover:shadow-md transition-shadow text-neutral-600 hover:text-[#bb1919] inline-block"
                                >
                                    {dict.weekly.weekNumber
                                        .replace('%week%', String(weekNumber))
                                        .replace('%year%', String(year))}
                                </Link>
                            </div>
                        </div>
                    </>
                )}

                <FloatingToc items={tocItems} lang={lang} />

                {newsGroup.clusters.map((cluster, index) => {
                    const [main, ...related] = cluster.articles;
                    if (!main?.content) return null;

                    const articleId = slugify(main.content.title_en || `article-${index}`);
                    return (
                        <section key={main.url} id={articleId} className="mb-12 bg-white shadow-sm rounded-sm overflow-hidden scroll-mt-20">
                            <ArticleMain content={main.content} url={main.url} lang={lang} useRelativeTime={false} />
                            <RelatedArticles
                                articles={related.filter((article: Article | null): article is Article => article?.content !== null)}
                                lang={lang}
                                useRelativeTime={false}
                            />
                        </section>
                    );
                })}

                {/* 底部周报链接 */}
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
                            {dict.weekly.weeklyNewsTitle}
                        </div>
                        <div className="text-sm text-neutral-600 mb-3">
                            {dict.weekly.weeklyNewsDescription}
                        </div>
                        <Link
                            href={weekLink || ''}
                            className="text-sm px-3 py-1 bg-neutral-50 rounded-full shadow-sm hover:shadow-md transition-shadow text-neutral-600 hover:text-[#bb1919] inline-block"
                        >
                            {dict.weekly.weekNumber
                                .replace('%week%', String(weekNumber))
                                .replace('%year%', String(year))}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
} 