/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Abaikan error TypeScript saat build
  typescript: {
    // !! PERINGATAN !!
    // Ini memungkinkan produksi build selesai meskipun ada
    // kesalahan type-checking. Gunakan hanya saat darurat/MVP.
    ignoreBuildErrors: true,
  },

  // 2. Abaikan error ESLint saat build
  eslint: {
    // Ini memungkinkan produksi build selesai meskipun ada
    // kesalahan linting.
    ignoreDuringBuilds: true,
  },

  // 3. Konfigurasi Image Optimization (Penting untuk Landing Page)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Mendukung format modern untuk performance
    formats: ['image/avif', 'image/webp'],
  },

  // 4. Kompresi untuk mempercepat loading
  compress: true,

  // 5. Opsi tambahan jika menggunakan Tailwind (biasanya otomatis)
  // swcMinify: true,

  // 6. Redirect ke Landing Page
  async redirects() {
    return [
      {
        source: '/',
        destination: '/lp',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
