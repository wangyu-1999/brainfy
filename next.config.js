/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/admin',
          destination: '/admin/index.html',
        },
        {
          source: '/content/:path*',
          destination: '/api/static/:path*'
        }
      ];
    },
}

module.exports = nextConfig
