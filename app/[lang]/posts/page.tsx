import { Metadata } from 'next'
import { PostCard } from '../components/PostCard'
import { getAllPosts } from '@/lib/posts'

export async function generateMetadata(props: { 
  params: { lang: string } 
}): Promise<Metadata> {
  const { lang } = await Promise.resolve(props.params)
  const title = lang === 'zh' 
    ? 'Brainfy 新闻 | 实时新闻资讯'
    : 'Brainfy News | Real-time News Updates'
  const description = lang === 'zh'
    ? '获取最新的科技、商业和全球新闻资讯。'
    : 'Get the latest updates on technology, business, and global news.'

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

export default async function Home(props: { 
  params: { lang: string } 
}) {
  const { lang } = await Promise.resolve(props.params)
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