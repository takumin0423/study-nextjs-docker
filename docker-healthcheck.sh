#!/bin/sh
# Dockerコンテナのヘルスチェックスクリプト

# ヘルスチェックエンドポイントへのリクエスト
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)

# HTTPステータスコードが200の場合は正常
if [ "$response" = "200" ]; then
    exit 0
else
    exit 1
fi