import { getDictionary } from '@/lib/i18n/dictionaries'
import { Language } from '@/lib/constants'
import { ArticleMain } from '../components/ArticleMain'
import { RelatedArticles } from '../components/RelatedArticles'
import { getLatestNews } from "../utils/getLatestNews";
import { FloatingToc, TocItem } from '../components/FloatingToc'
import { slugify } from '../utils/slugify'
import { getNewsRelatedFaqs } from '../utils/newsRelatedFaqs'
import { Faq } from '../components/Faq'

type PageParams = Promise<{ lang: Language }>

export const revalidate = 43200

export function generateStaticParams() {
    return [
        { lang: 'zh' },
        { lang: 'en' }
    ]
}

export default async function Page({
    params,
}: {
    params: PageParams;
}) {
    const { lang } = await params;
    const clusters = await getLatestNews();
    const dict = await getDictionary(lang);
    const faqItems = getNewsRelatedFaqs(lang);

    if (!clusters.length) {
        return <div className="text-center py-10">{dict.noData}</div>;
    }

    // 为每个新闻组创建目录项
    const tocItems = clusters
        .map((cluster) => {
            const title = cluster.articles[0]?.content?.title_en

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
            <div className="max-w-4xl mx-auto px-4 py-6 relative">
                <h1 className="text-xl text-neutral-700 font-medium mb-6">
                    {dict.news.todayHeadlines}
                </h1>
                <FloatingToc items={tocItems} lang={lang} />

                {clusters.map((cluster, index) => {
                    const [main, ...related] = cluster.articles;
                    const title = main?.content?.title_en
                    const articleId = title ? slugify(title) : `article-${index}`;

                    return (
                      main?.content && (
                        <section
                          key={main.url}
                          id={articleId}
                          className="mb-12 bg-white shadow-sm rounded-sm overflow-hidden scroll-mt-20"
                        >
                          <ArticleMain
                            content={main.content}
                            url={main.url}
                            lang={lang}
                          />
                          <RelatedArticles
                            articles={related.filter(
                              (articleId) => articleId.content !== null
                            )}
                            lang={lang}
                          />
                        </section>
                      )
                    );
                })}
            </div>
            
            <Faq dict={dict} items={faqItems} lang={lang} />
        </main>
    );
} 
