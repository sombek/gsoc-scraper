/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "summerofcode.withgoogle.com",
      },
    ],
  },
};

export default nextConfig;
