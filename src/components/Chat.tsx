"use client";

import { Message } from "@/types";
import { useMemo } from "react";

interface ChatProps {
  items: Message[];
}

export default function Chat({ items }: ChatProps) {
  // Sort messages by CreatedAt ascending
  const sortedMessages = useMemo(() => {
    return [...items]
      .filter((msg) => msg.content && msg.content.trim())
      .sort(
        (a, b) =>
          new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
      );
  }, [items]);

  // Format timestamp
  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('he-IL', {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (sortedMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="text-center animate-slide-in">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-700 mb-2">אין הודעות</p>
          <p className="text-sm text-gray-500">
            {items.length > 0 
              ? `${items.length} הודעות נמצאו אך סוננו (תוכן ריק)`
              : "לא התקבלו הודעות לשיחה זו"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-y-auto p-3 md:p-6 space-y-2 md:space-y-3 min-h-0" 
      style={{
        WebkitOverflowScrolling: 'touch',
        background: 'linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(167, 139, 250, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)
        `
      }}
    >
      {sortedMessages.map((msg, index) => {
        const isIncoming = msg.message_type === "incoming" || msg.message_type === "in";
        
        return (
          <div
            key={msg.Id || index}
            className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 md:px-5 py-2 md:py-3 shadow-lg message-bubble ${
                isIncoming
                  ? "bg-white text-gray-900"
                  : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
              }`}
            >
              {/* Message content */}
              <div className="whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base">
                {msg.content}
              </div>
              
              {/* Timestamp and status */}
              <div
                className={`flex items-center justify-end mt-1.5 md:mt-2 text-[10px] md:text-xs space-x-1 space-x-reverse ${
                  isIncoming ? "text-gray-500" : "text-white/80"
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTimestamp(msg.CreatedAt)}</span>
                {!isIncoming && (
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* End spacer for better scrolling */}
      <div className="h-4"></div>
    </div>
  );
}
