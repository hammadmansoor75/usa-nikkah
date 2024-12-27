/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // Add your Cloudinary domain
  },
  experimental: {
    turbopack: true, // Enable Turbopack
  },
};

export default nextConfig;