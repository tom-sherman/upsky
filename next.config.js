/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/app",
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
