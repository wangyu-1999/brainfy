import { Metadata } from 'next'
import { queryTable, getNewsContent } from '../../lib/tableService'
import { NewsContent, Article, NewsCluster } from '../../types/news'
import { getDictionary } from '../../lib/i18n/dictionaries'

export const revalidate = 3600;

// 定义支持的语言
export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const;
type Language = typeof SUPPORTED_LANGUAGES[number];

// 生成静态路由
export async function generateStaticParams() {
    return SUPPORTED_LANGUAGES.map((lang) => ({
        lang,
    }));
}

// 元数据生成
export async function generateMetadata({
    params: { lang }
}: {
    params: { lang: Language }
}): Promise<Metadata> {
    return {
        title: lang === 'zh' ? '新闻聚合' : 'News Aggregator',
    }
}

// 页面组件
export default async function Home({
    params: { lang }
}: {
    params: { lang: 'zh' | 'en' }
}) {
    const clusters = await getLatestNews();
    const dict = await getDictionary(lang);

    if (!clusters.length) {
        return <div className="text-center py-10">{dict.noData}</div>;
    }

    return (
        <main className="min-h-screen bg-neutral-100">
            <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="h-14 flex items-center">
                        <span className="text-xl font-bold text-[#bb1919] font-serif">
                            {dict.title}
                        </span>
                    </h1>
                    <LanguageSwitcher currentLang={lang} />
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-6">
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
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight font-serif tracking-tight mb-1">
                    {lang === 'zh' ? content.title_cn : content.title_en}
                </h2>
                {lang === 'zh' && content.title_en && (
                    <p className="text-sm text-[#bb1919] mb-3 font-medium">
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
                        className="font-medium hover:text-[#bb1919] transition-colors">
                        {content.source_name}
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

// 添加 RelatedArticles 组件
function RelatedArticles({ articles, lang }: {
    articles: Article[];
    lang: 'zh' | 'en';
}) {
    if (!articles.length) return null;

    return (
        <div className="border-t border-neutral-100">
            <div className="p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-4 font-sans">
                    {lang === 'zh' ? '相关报道' : 'Related News'}
                </h3>
                <div className="space-y-4">
                    {articles.map(article => article.content && (
                        <div key={article.url}
                            className="pl-4 border-l-2 border-neutral-100 hover:border-[#bb1919] transition-colors">
                            <a href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group">
                                <h4 className="text-sm font-medium text-neutral-900 group-hover:text-[#bb1919] line-clamp-2 mb-1">
                                    {lang === 'zh' ? article.content.title_cn : article.content.title_en}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <span>{article.content.source_name}</span>
                                    <span>•</span>
                                    <time>{formatDate(article.content.date, lang)}</time>
                                </div>
                            </a>
                        </div>
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