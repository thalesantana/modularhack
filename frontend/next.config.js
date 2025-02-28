/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',  // This specifies the output directory name
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
