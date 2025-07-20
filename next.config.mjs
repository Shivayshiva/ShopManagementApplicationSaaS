// next.config.js
import nextPWA from 'next-pwa'

  const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development', // disable in dev mode
  })

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'www.pexels.com'], // remove `https://` from domain
  },
  experimental: {
    appDir: true, // required for App Router support
  },
}

export default withPWA(nextConfig)
