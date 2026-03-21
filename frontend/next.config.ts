import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Necessário para o Dockerfile multi-stage (standalone build)
  output: "standalone",

  // Proxy /api/* → backend (evita CORS e expõe só uma origem)
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
