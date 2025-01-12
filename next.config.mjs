import withPWA from 'next-pwa';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable:process.env.NODE_ENV === 'development'
});

export default withPWAConfig(nextConfig);

