import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { getAllPosts, getPostData } from '@/lib/posts'
import { Language } from '@/lib/constants'

// 生成元数据
export async function generateMetadata(
  {params}:{params:Promise<{ id: string; lang: Language }>}
): Promise<Metadata> {

  const { id } = await params
  const post = await getPostData(id)
  
  return {
    title: `${post.title} | Brainfy`,
    description: post.description,
    openGraph: {
      title: `${post.title} | Brainfy`,
      description: post.description,
    },
  }
}

// 生成静态路径
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.flatMap(post => [
    { lang: 'en', id: post.id },
    { lang: 'zh', id: post.id }
  ])
}

interface PostPageProps {
    params: Promise<{
        id: string;
        lang: string;
    }>;
}

// 主页面组件
export default async function PostPage({ params }: PostPageProps) {
  const { id, lang } = await params
  const post = await getPostData(id)

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto pt-4 px-4 sm:px-6">
        <Link
          href={`/${lang}/posts`}
          className="inline-flex items-center text-neutral-600 hover:text-[#bb1919] 
            transition-colors text-sm mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mr-2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>{lang === 'zh' ? '返回' : 'Back'}</span>
        </Link>
      </div>

      {/* 文章主体内容 */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {/* 特色图片 - 优化与文章的衔接 */}
        {post.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-md">
            <div className="relative w-full aspect-[21/9]">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75vw"
              />
            </div>
          </div>
        )}

        {/* 文章内容容器 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 文章头部信息 */}
          <header className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b border-neutral-100">
            {/* 文章元信息 */}
            <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
              <time className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {new Date(post.date).toLocaleDateString()}
              </time>
            </div>
          </header>

          {/* 文章内容 - 优化排版和间距 */}
          <div className="px-6 sm:px-10 py-8 sm:py-12">
            <div
              className="prose prose-neutral max-w-none
                prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed 
                prose-p:text-neutral-700
                
                prose-headings:text-neutral-900 prose-headings:font-bold
                prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                
                prose-strong:text-neutral-900 prose-strong:font-semibold 
                prose-strong:bg-yellow-50/80
                
                prose-a:text-[#bb1919] prose-a:no-underline hover:prose-a:underline
                prose-a:font-medium prose-a:transition-colors
                
                prose-blockquote:text-lg prose-blockquote:leading-relaxed
                prose-blockquote:text-neutral-600 prose-blockquote:border-l-4
                prose-blockquote:border-neutral-200 prose-blockquote:bg-neutral-50
                prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-8
                
                prose-ul:my-6 prose-li:my-2 prose-li:text-neutral-700
                
                prose-pre:bg-neutral-50 prose-pre:border prose-pre:border-neutral-200
                prose-pre:rounded-lg
                
                prose-code:text-neutral-800 prose-code:bg-neutral-100
                
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                
                prose-hr:border-neutral-200 prose-hr:my-12"
              dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
            />
          </div>
        </div>
        <div className="ml-3 mt-6">
          <Link
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/news`}
            className="text-[#bb1919] hover:underline font-medium transition-colors"
          >
            {lang === 'zh' ? '查看更多实时新闻' : 'Check out more real-time news'}
          </Link>
        </div>
      </article>
    </main>
  )
} 