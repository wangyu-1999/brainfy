import Image from 'next/image'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { NavBar } from '../components/NavBar'


interface NotFoundCatchAllProps {
    params: Promise<{
        lang: "en" | "zh",
    }>;
}

export async function generateMetadata({
    params,
}: NotFoundCatchAllProps) {
    const {lang} = await params
    const dictionary = await getDictionary(lang)
    
    return {
        title: dictionary.notFound.title,
        description: dictionary.notFound.description,
        robots: {
            index: false,
            follow: false
        }
    }
}

export default async function NotFoundCatchAll({ params }: NotFoundCatchAllProps) {
    const {lang} = await params
    const dictionary = await getDictionary(lang)
    return (
        <div>
            <NavBar 
                lang={lang} 
                dict={dictionary} 
                showHistoryLink={false}
            />
            <main className="min-h-[calc(100vh-3.5rem)] bg-neutral-100 flex items-center justify-center py-8">
                <div className="max-w-lg mx-auto px-4 text-center">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                        <Image
                            src="/404.svg"
                            alt="404 Not Found"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-neutral-900 mb-3 font-serif">
                        {dictionary.notFound.title}
                    </h1>
                    
                    <p className="text-neutral-600 mb-6">
                        {dictionary.notFound.description}
                    </p>
                    
                    <Link
                        href={`/${lang}`}
                        className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-[#bb1919] hover:bg-[#a31717] transition-colors duration-200"
                    >
                        {dictionary.notFound.backToHome}
                    </Link>
                </div>
            </main>
        </div>
    )
} 