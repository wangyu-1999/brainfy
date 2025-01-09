import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { getWeeklyNews } from "@/lib/githubService"
import Link from 'next/link'
import { FloatingToc, TocItem } from '../../../components/FloatingToc'
import { ArticleMain } from '../../../components/ArticleMain'

type PageProps = {
    params: Promise<{ lang: Language; week: string }>;
}

export const revalidate = 43200;

export async function generateMetadata({ params }: PageProps) {
    const { lang, week } = await params;
    const dict = await getDictionary(lang);
    const weekNumber = Number(week.split('-')[1]);
    const year = week.split('-')[0];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    // 获取实际的周数（因为URL中的周数需要-1）
    const actualWeek = `${year}-${String(Number(weekNumber) - 1).padStart(2, '0')}`;
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
        alternates: {
            languages: {
                'en': `${baseUrl}/en/news/weekly/${week}`,
                'zh': `${baseUrl}/zh/news/weekly/${week}`,
                'x-default': `${baseUrl}/en/news/weekly/${week}`
            },
            openGraph: {
                url: `${baseUrl}/${lang}/news/weekly/${week}`,
            }
        }
    }
}

export default async function WeeklyNewsPage({ params }: PageProps) {
    const { lang, week } = await params;
    const dict = await getDictionary(lang);
    const actualWeek = `${week.split('-')[0]}-${String(Number(week.split('-')[1]) - 1).padStart(2, '0')}`;
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
                    <div className="text-sm text-neutral-600">
                        {new Date(weeklyNews.date_range.earliest).toLocaleDateString()} - {new Date(weeklyNews.date_range.latest).toLocaleDateString()}
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
            </div>
        </main>
    );
} 