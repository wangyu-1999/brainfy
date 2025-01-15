import { NewsContent } from '../../../types/news'
import { ShareButton } from './ShareButton'
import { formatDate, formatHistoryDate } from '../utils/formatDate'

export function ArticleMain({ content, url, lang, useRelativeTime = true }: {
    content: NewsContent;
    url: string;
    lang: 'zh' | 'en';
    useRelativeTime?: boolean;
}) {
    return (
        <article className="p-8 space-y-6">
            <div className="block">
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight font-serif tracking-tight mb-3">
                    {lang === 'zh' ? content.title_cn : content.title_en}
                </h2>
                {lang === 'zh' && content.title_en && (
                    <p className="text-sm text-[#bb1919] mb-4 font-medium leading-relaxed">
                        {content.title_en}
                    </p>
                )}
            </div>
            <p className="text-lg text-neutral-700 leading-relaxed font-sans">
                {lang === 'zh' ? content.chinese_summary : content.english_summary}
            </p>
            <div className="flex items-center justify-between text-sm text-neutral-600">
                <div className="flex items-center gap-3">
                    <a href={`/${lang}/news/redirect?url=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer noindex nofollow"
                        className="group inline-flex items-center font-medium hover:text-[#bb1919] transition-colors"
                    >
                        <span>{content.source_name}</span>
                        <svg className="ml-1.5 w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
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
                    <span className="text-neutral-400">•</span>
                    <time>
                        {useRelativeTime 
                            ?  formatDate(content.date, lang) 
                            : formatHistoryDate(content.date, lang)
                        }
                    </time>
                </div>
                <ShareButton 
                    lang={lang} 
                    title={lang === 'zh' ? content.title_cn : content.title_en}
                    summary={lang === 'zh' ? content.chinese_summary : content.english_summary}
                    url={process.env.NEXT_PUBLIC_BASE_URL || ""}
                />
            </div>
        </article>
    );
} 