/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // EN KRİTİK SATIR BURASI!
  images: {
    unoptimized: true, // Statik sitede resimlerin çalışması için şart
  }
};

export default nextConfig;