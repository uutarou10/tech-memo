/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        port: '',
        pathname: '/secure.notion-static.com/**'
      }
    ]
  }
}
// http://localhost:3000/p/(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2025121-4a5b-4e20-8c60-2866b2aa20f0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221227%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221227T134424Z&X-Amz-Expires=3600&X-Amz-Signature=b6559af4385c28e33f29c0e2abd13e653b15bcc97437f77389a79e81dfcfc215&X-Amz-SignedHeaders=host&x-id=GetObject)

module.exports = nextConfig
