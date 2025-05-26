"use client";

interface MessageProps {
  message: { type: "success" | "error"; text: string } | null;
}

export default function Message({ message }: MessageProps) {
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
