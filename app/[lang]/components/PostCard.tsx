import Link from 'next/link'
import { Post } from '@/types/post'
import Image from 'next/image'

interface PostCardProps {
  post: Post
  lang: string
}

export function PostCard({ post, lang }: PostCardProps) {
  return (
    <article className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {post.thumbnail && (
        <div className="w-full h-48 relative mb-[-7rem] z-0">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 70%, white 100%)'
            }}
          />
        </div>
      )}
      <div className="p-6 relative z-10">
        <Link href={`/${lang}/posts/${post.id.replace(/_zh$/, '')}`} className="block">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight font-serif tracking-tight mb-3">
            {post.slug}
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