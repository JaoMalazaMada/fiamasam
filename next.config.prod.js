/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration optimisée pour la production
  output: 'standalone',
  
  // Optimisations d'images
  images: {
    domains: ['mpsanjaka-sakalava.mg'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirection et réécriture
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/articles',
        permanent: true,
      },
    ];
  },
  
  // Configuration pour Plesk/Apache
  trailingSlash: false,
  poweredByHeader: false,
  
  // Optimisations de build
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
