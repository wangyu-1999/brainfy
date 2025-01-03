import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'
import { getAllNews } from '../../utils/getLatestNews'
import { ArticleMain } from '../../components/ArticleMain'
import { RelatedArticles } from '../../components/RelatedArticles'
import Link from 'next/link'
import { formatHistoryDate } from '../../utils/formatDate'
import { FloatingToc, TocItem } from '../../components/FloatingToc'
import { slugify } from '../../utils/slugify'
import { Article } from '@/types/news'

type PageParams = Promise<{
    lang: Language;
    date: string;
}>

export const dynamic = 'force-dynamic'
export const revalidate = 21600

export async function generateMetadata({
    params
}: {
    params: PageParams
}): Promise<Metadata> {
    const { lang, date } = await params;
    const dict = await getDictionary(lang);
    const formattedDate = new Date(decodeURIComponent(date)).toLocaleDateString(
        lang === 'zh' ? 'zh-CN' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return {
        title: `${formattedDate} - ${dict.history.title}`,
    }
}

export default async function HistoryDetailPage({
    params,
}: {
    params: PageParams;
}) {
    const { lang, date } = await params;
    const allNews = await getAllNews();
    const dict = await getDictionary(lang);

    const newsGroup = allNews.find(group => {
        const groupDate = group.date.replace(' UTC', '').replace(/[: ]/g, '-');
        return groupDate === date;
    });

    if (!newsGroup) {
        return (
            <main className="min-h-screen bg-neutral-100">
                <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                        <h1 className="h-14 flex items-center gap-4">
                            <Link href={`/${lang}`} className="text-xl font-bold text-[#bb1919] font-serif">
                                {dict.title}
                            </Link>
                            <span className="text-neutral-500">|</span>
                            <Link href={`/${lang}/history`} className="text-lg text-neutral-900 hover:text-[#bb1919]">
                                {dict.history.title}
                            </Link>
                        </h1>
                        <LanguageSwitcher currentLang={lang} />
                    </div>
                </nav>
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-center py-10">{dict.noData}</div>
                </div>
            </main>
        );
    }

    const formattedDate = formatHistoryDate(newsGroup.date);

    const tocItems = newsGroup.clusters
        .map((cluster, index) => {
            const mainArticle = cluster.articles[0];
            const title = lang === 'zh'
                ? mainArticle?.content?.title_cn
                : mainArticle?.content?.title_en;

            if (!title) return null;

            return {
                id: slugify(mainArticle?.content?.title_en || `article-${index}`),
                title
            };
        })
        .filter((item): item is TocItem => item !== null);

    return (
        <main className="min-h-screen bg-neutral-100">
            <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="h-14 flex items-center gap-4">
                        <Link href={`/${lang}`} className="text-xl font-bold text-[#bb1919] font-serif">
                            {dict.title}
                        </Link>
                        <span className="text-neutral-500">|</span>
                        <Link href={`/${lang}/history`} className="text-lg text-neutral-900 hover:text-[#bb1919]">
                            {dict.history.title}
                        </Link>
                    </h1>
                    <LanguageSwitcher currentLang={lang} />
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-6 relative">
                <FloatingToc items={tocItems} lang={lang} />

                <div className="mb-6 text-center">
                    <time className="text-lg text-neutral-600">{formattedDate}</time>
                </div>

                {newsGroup.clusters.map((cluster, index) => {
                    const [main, ...related] = cluster.articles;
                    const title = main?.content?.title_en || main?.content?.title_cn;
                    const articleId = title ? slugify(title) : `article-${index}`;

                    return main?.content && (
                        <section
                            key={main.url}
                            id={articleId}
                            className="mb-12 bg-white shadow-sm rounded-sm overflow-hidden scroll-mt-20"
                        >
                            <ArticleMain
                                content={main.content}
                                url={main.url}
                                lang={lang}
                                useRelativeTime={false}
                            />
                            <RelatedArticles
                                articles={related.filter((article): article is Article => article.content !== null)}
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