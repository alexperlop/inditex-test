/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prueba-tecnica-api-tienda-moviles.onrender.com',
        pathname: '/images/**',
      },
    ],
  },
  sassOptions: {
    includePaths: ['./src/shared/styles'],
    loadPaths: ['./src/shared/styles'],
  },
  experimental: {
    optimizePackageImports: ['@tanstack/react-query'],
  },
};

export default nextConfig;
