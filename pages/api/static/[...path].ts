import { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'path'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import mime from 'mime-types'  // 需要安装: npm install mime-types

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 获取请求的文件路径
    const { path } = req.query
    const filePath = join(process.cwd(), 'content', ...(path as string[]))

    // 检查文件是否存在
    await stat(filePath)

    // 获取文件的 MIME 类型
    const contentType = mime.lookup(filePath) || 'application/octet-stream'
    res.setHeader('Content-Type', contentType)

    // 设置缓存头
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

    // 创建文件流并发送
    const stream = createReadStream(filePath)
    stream.pipe(res)
  } catch (e) {
    res.status(404).end('File not found')
  }
} 