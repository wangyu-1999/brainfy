import { formatDate, formatHistoryDate } from '../utils/formatDate'
import { Article } from '../../../types/news'

export async function RelatedNewsItem({ article, lang, useRelativeTime = true }: {
    article: Article;
    lang: 'zh' | 'en';
    useRelativeTime?: boolean;
}) {
    if (!article.content) return null;

    const formattedDate = useRelativeTime
        ? formatDate(article.content.date, lang)
        : formatHistoryDate(article.content.date, lang);

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
                        <div className="flex-1 text-sm font-medium text-neutral-900 group-hover:text-[#bb1919] transition-colors duration-200">
                            {lang === 'zh' ? article.content.title_cn : article.content.title_en}
                        </div>
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
                        <div className="[input:checked+label_&]:max-h-[2000px] [input:checked+label_&]:opacity-100 max-h-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                            <p className="text-sm text-neutral-600 mt-3 mb-3 leading-relaxed">
                                {lang === 'zh' ? article.content.chinese_summary : article.content.english_summary}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-2">
                        <a
                            href={`/${lang}/news/redirect?url=${encodeURIComponent(article.url)}`}
                            target="_blank"
                            rel="noopener noreferrer noindex nofollow"
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
                        <time>{formattedDate}</time>
                    </div>
                </div>
            </label>
        </div>
    );
} 