// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Development-only dynamic allowance for all local IPs on port 3000
  allowedDevOrigins:
    process.env.NODE_ENV === "development"
      ? Array.from({ length: 256 }, (_, i) => `http://192.168.0.${i}:3000`)
          .concat(
            Array.from({ length: 256 }, (_, i) => `http://10.0.0.${i}:3000`)
          )
      : undefined,
};

export default nextConfig;