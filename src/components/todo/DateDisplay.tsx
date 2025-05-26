"use client";

interface DateDisplayProps {
  dateString: string;
  className?: string;
}

export default function DateDisplay({
  dateString,
  className = "",
}: DateDisplayProps) {
  const formattedDate = new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });

  return <span className={className}>{formattedDate}</span>;
}
