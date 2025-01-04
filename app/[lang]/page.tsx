import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { ArticleMain } from './components/ArticleMain'
import { RelatedArticles } from './components/RelatedArticles'
import { getLatestNews } from './utils/getLatestNews'
import { Article } from '@/types/news'
import { FloatingToc, TocItem } from './components/FloatingToc'
import { slugify } from './utils/slugify'
import { NavBar } from './components/NavBar'

// 使用 Promise 类型的 params
type PageParams = Promise<{ lang: Language }>

export const revalidate = 43200

// 静态路由参数生成
export function generateStaticParams() {
    return [
        { lang: 'zh' },
        { lang: 'en' }
    ]
}

// 页面组件
export default async function Page({
    params,
}: {
    params: PageParams;
}) {
    const { lang } = await params;
    const clusters = await getLatestNews();
    const dict = await getDictionary(lang);

    if (!clusters.length) {
        return <div className="text-center py-10">{dict.noData}</div>;
    }

    // 为每个新闻组创建目录项
    const tocItems = clusters
        .map((cluster) => {
            const title = cluster.articles[0]?.content?.title_en ||
                cluster.articles[0]?.content?.title_cn;

            return title ? {
                id: slugify(title),
                title: lang === 'zh'
                    ? cluster.articles[0]?.content?.title_cn
                    : cluster.articles[0]?.content?.title_en
            } : null;
        })
        .filter((item): item is TocItem => item !== null);

    return (
        <main className="min-h-screen bg-neutral-100">
            <NavBar lang={lang} dict={dict} />
            <div className="max-w-4xl mx-auto px-4 py-6 relative">
                <FloatingToc items={tocItems} lang={lang} />

                {clusters.map((cluster, index) => {
                    const [main, ...related] = cluster.articles;
                    const title = main?.content?.title_en || main?.content?.title_cn;
                    const articleId = title ? slugify(title) : `article-${index}`;

                    return main?.content && (
                        <section
                            key={main.url}
                            id={articleId}
                            className="mb-12 bg-white shadow-sm rounded-sm overflow-hidden scroll-mt-20"
                        >
                            <ArticleMain content={main.content} url={main.url} lang={lang} />
                            <RelatedArticles
                                articles={related.filter((article): article is Article => article.content !== null)}
                                lang={lang}
                            />
                        </section>
                    );
                })}
            </div>
        </main>
    );
} 
