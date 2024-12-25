/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
      domains: ['res.cloudinary.com'], // Add your Cloudinary domain
    },
  };
  
  export default nextConfig;
  