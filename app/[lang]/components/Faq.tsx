interface FaqProps {
    dict: any
    items: {
        question: string
        answer: string
    }[]
    lang: string
}

export function Faq({ dict, items, lang }: FaqProps) {
    return (
        <section className="border-t border-neutral-100 bg-white">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <header className="mb-6">
                    <h2 className="text-base font-medium text-neutral-900 mb-2">
                        {dict.faq.title}
                    </h2>
                    <div className="w-8 h-0.5 bg-[#bb1919]/20" />
                </header>

                <div className="grid gap-8 md:grid-cols-2">
                    {items.map((item, index) => (
                        <article key={index} className="space-y-2">
                            <h3 className="text-sm font-medium text-neutral-900">
                                {item.question}
                            </h3>
                            <p className="text-xs leading-relaxed text-neutral-600">
                                {item.answer}
                            </p>
                        </article>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100">
                    <p className="text-xs text-center text-neutral-500">
                        {lang === 'zh' ? '还有其他问题？' : 'Have more questions?'}{' '}
                        <a 
                            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                            className="text-[#bb1919] hover:underline"
                        >
                            {lang === 'zh' ? '联系我们获取更多帮助' : 'Contact us for assistance'}
                        </a>
                    </p>
                </div>
            </div>
        </section>
    )
}
