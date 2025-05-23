import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // サーバーサイド専用モジュールの設定
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでは Node.js モジュールを無効化
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        os: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },

  // サーバー専用パッケージの設定
  serverExternalPackages: ["pg", "drizzle-orm"],

  // 実験的機能
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // パフォーマンス最適化
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
