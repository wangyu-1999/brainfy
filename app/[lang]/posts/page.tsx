import { Metadata } from 'next'
import { PostCard } from '../components/PostCard'
import { getAllPosts } from '@/lib/posts'

interface HomeProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { lang } = await params
  const title = lang === 'zh' 
    ? 'Brainfy 新闻评论 | 深度观点分析'
    : 'Brainfy News Commentary | In-depth Analysis'
  const description = lang === 'zh'
    ? '深入解读热点新闻，提供独到的分析视角和专业评论。'
    : 'In-depth analysis and professional commentary on current news and events.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'zh' }
  ]
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params
  const posts = getAllPosts().filter(post => post.language === lang)

  return (
    <main className="min-h-screen bg-neutral-100">  
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-xl text-neutral-700 font-medium mb-6">
          {lang === 'zh' ? '新闻评论' : 'News Commentary'}
        </h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} lang={lang} />
          ))}
        </div>
      </div>
    </main>
  )
} 