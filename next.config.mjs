/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/studio', destination: '/ai', permanent: true },
      { source: '/pricing', destination: '/bao-gia', permanent: true },
      { source: '/quotes', destination: '/bao-gia', permanent: true },
      { source: '/customers', destination: '/', permanent: true },
      { source: '/projects', destination: '/', permanent: true },
      { source: '/admin', destination: '/', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
