export interface Post {
  id: string
  title: string
  date: string
  description?: string
  thumbnail?: string
  content?: string
  contentHtml?: string
  language: string
  slug: string
}

export interface CMSField {
    label: string
    name: string
    widget: string
  required?: boolean
} 