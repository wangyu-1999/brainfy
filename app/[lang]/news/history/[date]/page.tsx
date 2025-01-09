import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { getAllNewsWithoutContent, getNewsByDate } from '../../../utils/getLatestNews'
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

export const revalidate = 43200

export async function generateMetadata({ params }: PageProps) {
    const { lang, date } = await params;
    const dict = await getDictionary(lang);
    
    // 获取所有新闻时间点
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

    // 构建更丰富的描述
    const pageDescription = mainTitles.length > 0
        ? `${dict.history.title}: ${mainTitles.join('. ')}. ${dict.history.dayDescription.replace('%date%', formattedDate)}`
        : `${dict.history.dayDescription.replace('%date%', date)}`;

    // 构建SEO友好的标题
    const pageTitle = `${formattedDate} - ${dict.history.title}`;

    return {
        title: pageTitle,
        description: pageDescription,
        alternates: {
            languages: {
                'en': `${baseUrl}/en/news/history/${date}`,
                'zh': `${baseUrl}/zh/news/history/${date}`,
                'x-default': `${baseUrl}/en/news/history/${date}`
            },
            openGraph: {
                url: `${baseUrl}/${lang}/news/history/${date}`,
            }
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
        return (
            <main className="min-h-screen bg-neutral-100">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-center py-10">{dict.noData}</div>
                </div>
            </main>
        );
    }

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
            </div>
        </main>
    );
} 