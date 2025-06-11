import { NextResponse } from "next/server";

/**
 * ミドルウェア：セキュリティとパフォーマンスの向上
 */
export function middleware() {
  const response = NextResponse.next();

  // Content Security Policy（CSP）の設定
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  // リクエストレート制限のための基本的なヘッダー
  response.headers.set("X-RateLimit-Limit", "100");
  response.headers.set("X-RateLimit-Remaining", "99");

  return response;
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: [
    /*
     * 以下のパスを除くすべてのリクエストパスに一致：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};