import Link from 'next/link'
import { Post } from '@/types/post'

interface PostCardProps {
  post: Post
  lang: string
}

export function PostCard({ post, lang }: PostCardProps) {
  return (
    <article className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <Link href={`/${lang}/posts/${post.id}`} className="block">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight font-serif tracking-tight mb-3">
            {post.title}
          </h2>
          <p className="text-lg text-neutral-700 leading-relaxed font-sans">
            {post.description}
          </p>
          <time className="flex items-center justify-between text-sm text-neutral-600 mt-5">
            {new Date(post.date).toLocaleDateString()}
          </time>
        </Link>
      </div>
    </article>
  )
} 