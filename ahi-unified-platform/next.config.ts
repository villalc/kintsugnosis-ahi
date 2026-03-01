import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // Optimización para Docker/Cloud Run
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-AHI-Integrity', value: '84.2%' },
          { key: 'X-Sovereignty-Protocol', value: 'SAP v0.1.0' },
        ],
      },
    ];
  },
};

export default nextConfig;
