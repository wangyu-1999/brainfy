import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { getAllNewsWithoutContent, getNewsByDate } from '../../utils/getLatestNews'
import { ArticleMain } from '../../components/ArticleMain'
import { RelatedArticles } from '../../components/RelatedArticles'
import Link from 'next/link'
import { formatHistoryDate } from '../../utils/formatDate'
import { FloatingToc, TocItem } from '../../components/FloatingToc'
import { slugify } from '../../utils/slugify'
import { Article } from '@/types/news'
import { formatUrlDate } from '../../utils/formatUrlDate'
import { NavBar } from '../../components/NavBar'

// 简化类型定义
type PageProps = {
    params: Promise<{ lang: Language; date: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
    const allNews = await getAllNewsWithoutContent()
    return allNews.flatMap(group => [
        { lang: 'zh', date: formatUrlDate(group.date) },
        { lang: 'en', date: formatUrlDate(group.date) }
    ])
}

export const revalidate = 43200

export async function generateMetadata({ params }: PageProps) {
    const { lang, date } = await params;
    const dict = await getDictionary(lang);

    return {
        title: `${date} - ${dict.history.title}`,
        description: dict.history.dayDescription.replace('%date%', date),
        alternates: {
            languages: {
                'en': `/en/history/${date}`,
                'zh': `/zh/history/${date}`,
                'x-default': `/en/history/${date}`
            }
        }
    }
}

export default async function HistoryDetailPage({ params }: PageProps) {
    const { lang, date } = await params;
    const dict = await getDictionary(lang);
    const newsGroup = await getNewsByDate(date);

    if (!newsGroup) {
        return (
            <main className="min-h-screen bg-neutral-100">
                <NavBar lang={lang} dict={dict} isHistoryPage={true} />
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
            <NavBar lang={lang} dict={dict} isHistoryPage={true} />
            <div className="max-w-4xl mx-auto px-4 py-6 relative">
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href={`/${lang}/history`}
                        className="flex items-center gap-1.5 text-neutral-500 hover:text-[#bb1919] transition-colors text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span>{dict.history.backToArchives}</span>
                    </Link>
                    <time className="text-sm text-neutral-500">{formatHistoryDate(newsGroup.date)}</time>
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