import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // サーバー専用パッケージの設定
  serverExternalPackages: ["pg", "drizzle-orm"],

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
