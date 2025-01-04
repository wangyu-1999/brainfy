import { Article } from '@/types/news'
import { RelatedNewsItem } from './RelatedNewsItem'
import { getDictionary } from '@/lib/i18n/dictionaries'

export async function RelatedArticles({ articles, lang, useRelativeTime = true }: {
    articles: Article[];
    lang: 'zh' | 'en';
    useRelativeTime?: boolean;
}) {
    if (!articles.length) return null;
    
    const dict = await getDictionary(lang)

    return (
        <div className="border-t border-neutral-100">
            <div className="p-6">
                <div className="text-base font-bold text-neutral-900 font-sans mb-4">
                    {dict.relatedNews}
                    <span className="ml-2 text-neutral-500 font-normal">
                        ({articles.length})
                    </span>
                </div>
                <div className="space-y-4">
                    {articles.map(article => (
                        <RelatedNewsItem
                            key={article.url}
                            article={article}
                            lang={lang}
                            useRelativeTime={useRelativeTime}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 