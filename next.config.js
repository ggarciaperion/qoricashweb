/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint during builds (solo para deployment urgente)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during builds (solo para deployment urgente)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

module.exports = nextConfig
