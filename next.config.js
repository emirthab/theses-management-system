/** @type {import('next').NextConfig} */
const nextConfig = {
  env:{
    DATABASE_URL: "postgresql://postgres:RswOYGzrtYEdkGiuvlgOJKWGxcvQaUFe@monorail.proxy.rlwy.net:36370/railway",
  },
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
  typescript:{
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;
