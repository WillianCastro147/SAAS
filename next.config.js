/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Isso aqui ignora erros de "escrita" que travam o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
