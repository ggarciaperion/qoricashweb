/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' no funciona con rutas dinámicas [id]
  // Se despliega como Web Service en lugar de Static Site
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
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
