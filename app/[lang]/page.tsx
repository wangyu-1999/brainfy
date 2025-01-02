import { Metadata } from 'next'
import { queryTable, getNewsContent } from '../../lib/tableService'
import { NewsContent, Article, NewsCluster } from '../../types/news'
import { getDictionary } from '../../lib/i18n/dictionaries'
import { Language } from '../../lib/constants'

export const revalidate = 3600;

// 生成静态路由
export async function generateStaticParams(): Promise<{ lang: Language }[]> {
    return [
        { lang: 'zh' },
        { lang: 'en' }
    ]
}

// 元数据生成
export async function generateMetadata({
    params,
}: {
    params: { lang: Language }
}): Promise<Metadata> {
    const { lang } = params;
    return {
        title: lang === 'zh' ? '新闻聚合' : 'News Aggregator',
    }
}

// 页面组件
export default async function Home({
    params,
}: {
    params: { lang: Language }
}) {
    const { lang } = params;
    const clusters = await getLatestNews();
    const dict = await getDictionary(lang);

    if (!clusters.length) {
        return <div className="text-center py-10">{dict.noData}</div>;
    }

    return (
        <main className="min-h-screen bg-neutral-100">
            <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="h-14 flex items-center">
                        <span className="text-xl font-bold text-[#bb1919] font-serif">
                            {dict.title}
                        </span>
                    </h1>
                    <LanguageSwitcher currentLang={lang} />
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {clusters.map(cluster => {
                    const [main, ...related] = cluster.articles;
                    return main?.content && (
                        <section key={main.url} className="mb-12 bg-white shadow-sm rounded-sm overflow-hidden">
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

// 语言切换组件
function LanguageSwitcher({ currentLang }: { currentLang: Language }) {
    const targetLang = currentLang === 'zh' ? 'en' : 'zh';

    return (
        <a
            href={`/${targetLang}`}
            className="px-3 py-1 rounded border border-neutral-200 hover:border-[#bb1919]"
        >
            {currentLang === 'zh' ? 'English' : '中文'}
        </a>
    );
}

// 修改文章组件
function ArticleMain({ content, url, lang }: {
    content: NewsContent;
    url: string;
    lang: 'zh' | 'en';
}) {
    return (
        <article className="p-6 space-y-4">
            <div className="block">
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight font-serif tracking-tight mb-2">
                    {lang === 'zh' ? content.title_cn : content.title_en}
                </h2>
                {lang === 'zh' && content.title_en && (
                    <p className="text-sm text-[#bb1919] mb-3 font-medium leading-relaxed">
                        {content.title_en}
                    </p>
                )}
            </div>
            <p className="text-lg text-neutral-600 leading-relaxed font-sans">
                {lang === 'zh' ? content.chinese_summary : content.english_summary}
            </p>
            <div className="flex items-center justify-between text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                    <a href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center font-medium hover:text-[#bb1919] transition-colors"
                    >
                        <span>{content.source_name}</span>
                        <svg className="ml-1 w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                    <span>•</span>
                    <time>{formatDate(content.date, lang)}</time>
                </div>
                <ShareButton lang={lang} />
            </div>
        </article>
    );
}

function formatDate(dateString: string, lang: 'zh' | 'en') {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (lang === 'zh') {
        if (diffDays === 0) return '今天';
        if (diffDays === 1) return '昨天';
        if (diffDays < 7) return `${diffDays}天前`;
        return date.toLocaleDateString('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    } else {
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }
}

async function getLatestNews() {
    try {
        const clusters = await queryTable();
        const lastCluster = clusters.at(-1);

        if (!lastCluster?.clusters) {
            console.error('无效的聚类数据');
            return [];
        }

        const parsedClusters: NewsCluster[] = JSON.parse(lastCluster.clusters.toString());
        const sortedClusters = parsedClusters.sort((a, b) => (b.size || 0) - (a.size || 0));

        return Promise.all(sortedClusters.map(async (cluster) => ({
            ...cluster,
            articles: await Promise.all(
                cluster.articles
                    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
                    .map(async (article) => ({
                        ...article,
                        content: await getNewsContent(article.url)
                    }))
            )
        })));
    } catch (error) {
        console.error('获取新闻数据失败:', error);
        return [];
    }
}

// 单个相关新闻项组件
function RelatedNewsItem({ article, lang }: {
    article: Article;
    lang: 'zh' | 'en'
}) {
    if (!article.content) return null;

    return (
        <div>
            <input
                type="checkbox"
                id={`news-${article.url}`}
                className="peer hidden"
            />
            <label
                htmlFor={`news-${article.url}`}
                className="block cursor-pointer"
            >
                <div className="pl-4 border-l-2 border-neutral-100 hover:border-[#bb1919] transition-all duration-300">
                    <div className="flex items-start justify-between gap-2 group">
                        <h4 className="flex-1 text-sm font-medium text-neutral-900 group-hover:text-[#bb1919] transition-colors duration-200">
                            {lang === 'zh' ? article.content.title_cn : article.content.title_en}
                        </h4>
                        <svg
                            className="w-4 h-4 mt-1 text-neutral-400 transition-transform duration-500 ease-in-out peer-checked:rotate-180 group-hover:text-[#bb1919]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>

                    <div className="overflow-hidden transition-all duration-500 ease-in-out">
                        <div className="[input:checked+label_&]:max-h-[500px] [input:checked+label_&]:opacity-100 max-h-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                            <p className="text-sm text-neutral-600 mt-3 mb-3 leading-relaxed">
                                {lang === 'zh' ? article.content.chinese_summary : article.content.english_summary}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-2">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center font-medium text-neutral-500 hover:text-[#bb1919] transition-colors duration-200 group/link"
                        >
                            <span>{article.content.source_name}</span>
                            <svg
                                className="ml-1 w-3 h-3 opacity-40 group-hover/link:opacity-100 transition-all duration-200"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                        <span>•</span>
                        <time>{formatDate(article.content.date, lang)}</time>
                    </div>
                </div>
            </label>
        </div>
    );
}

// 相关新闻列表组件
function RelatedArticles({ articles, lang }: {
    articles: Article[];
    lang: 'zh' | 'en';
}) {
    if (!articles.length) return null;

    return (
        <div className="border-t border-neutral-100">
            <div className="p-6">
                <h3 className="text-base font-bold text-neutral-900 font-sans mb-4">
                    {lang === 'zh' ? '相关报道' : 'Related News'}
                    <span className="ml-2 text-neutral-500 font-normal">
                        ({articles.length})
                    </span>
                </h3>
                <div className="space-y-4">
                    {articles.map(article => (
                        <RelatedNewsItem
                            key={article.url}
                            article={article}
                            lang={lang}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ShareButton({ lang }: { lang: 'zh' | 'en' }) {
    return (
        <button className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#bb1919]">
            <span className="sr-only">{lang === 'zh' ? '分享' : 'Share'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
        </button>
    );
} 