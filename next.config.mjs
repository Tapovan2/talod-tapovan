/** @type {import('next').NextConfig} */
const nextConfig = {
  //skip the typescript error
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
    // ...
  },
};

export default nextConfig;
