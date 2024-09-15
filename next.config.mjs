/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "owcdn.net" }],
  },
};

export default nextConfig;
