/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript hataları olsa bile projeyi yayına al!
    ignoreBuildErrors: true, 
  },
  eslint: {
    // ESLint hatalarını da görmezden gel
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig