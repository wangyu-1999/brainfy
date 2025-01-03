import { Article } from '@/types/news'
import { RelatedNewsItem } from './RelatedNewsItem'

export function RelatedArticles({ articles, lang }: {
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