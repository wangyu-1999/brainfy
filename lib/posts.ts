import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { Post } from '../type'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName): Post => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      id,
      content,
      ...(data as Omit<Post, 'id' | 'content'>),
      date: new Date(data.date).toISOString(),
    }
  })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostData(id: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const processedContent = await remark()
    .use(html)
    .process(content)
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...(data as Omit<Post, 'id' | 'contentHtml'>),
    date: new Date(data.date).toISOString(),
  }
} 