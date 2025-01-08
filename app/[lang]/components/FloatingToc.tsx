import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Language } from '@/lib/constants';

export interface TocItem {
    id: string;
    title: string;
}

interface FloatingTocProps {
    items: TocItem[];
    lang: Language;
}

export async function FloatingToc({ items, lang }: FloatingTocProps) {
    const dict = await getDictionary(lang);

    return (
        <div className="hidden lg:block fixed right-0 top-24 group">
            <div className="absolute right-4 top-2 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center cursor-pointer text-neutral-600 group-hover:opacity-0 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </div>
            <div className="w-52 mr-0 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 max-h-[calc(100vh-120px)] overflow-y-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <div className="text-lg font-bold mb-4 text-neutral-900">
                    {dict.toc.title}
                </div>
                <nav className="space-y-2">
                    {items.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="block text-sm text-neutral-600 hover:text-[#bb1919] transition-colors line-clamp-2"
                        >
                            {item.title}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
} 