/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // 设置资源前缀为完整的 URL
    assetPrefix: process.env.NEXT_PUBLIC_BASE_URL,
    // 如果使用了 images 组件，也需要配置
    images: {
      domains: [
        process.env.NEXT_PUBLIC_BASE_URL,
        'brainfy-blog.vercel.app',
      ],
    },
    // 确保脚本加载正确
    crossOrigin: 'anonymous',
}

module.exports = nextConfig
