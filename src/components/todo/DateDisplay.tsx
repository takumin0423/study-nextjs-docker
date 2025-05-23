"use client";

import { useState, useEffect } from "react";

interface DateDisplayProps {
  dateString: string;
  className?: string;
}

export default function DateDisplay({
  dateString,
  className = "",
}: DateDisplayProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const date = new Date(dateString);
      const formatted = date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tokyo", // タイムゾーンを明示的に指定
      });
      setFormattedDate(formatted);
    } catch {
      setFormattedDate("無効な日付");
    }
  }, [dateString]);

  // クライアントサイドでのみレンダリング
  if (!isClient) {
    return <span className={className}>読み込み中...</span>;
  }

  return <span className={className}>{formattedDate}</span>;
}
