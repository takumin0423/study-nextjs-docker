"use client";

import { useEffect } from "react";

interface MessageProps {
  message: { type: "success" | "error"; text: string } | null;
  onClear: () => void;
}

export default function Message({ message, onClear }: MessageProps) {
  // メッセージを3秒後に自動で消す
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClear(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg ${
        message.type === "success"
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {message.text}
    </div>
  );
}
