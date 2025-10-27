"use client";

import { Message } from "@/types";
import { useMemo, useState, useRef, useEffect } from "react";

interface ConversationsListProps {
  messages: Message[];
  onSelect: (conversationId: string) => void;
  selected?: string;
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

interface ConversationPreview {
  conversation_id: string;
  customer_name?: string;
  customer_phone: string;
  lastMessage: Message;
  messageCount: number;
}

export default function ConversationsList({
  messages,
  onSelect,
  selected,
  className = "",
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Group messages by conversation_id
  const conversations = useMemo(() => {
    const grouped = new Map<string, Message[]>();

    messages.forEach((msg) => {
      if (!msg.content || !msg.content.trim()) return;
      const cid = msg.conversation_id;
      if (!grouped.has(cid)) {
        grouped.set(cid, []);
      }
      grouped.get(cid)!.push(msg);
    });

    const previews: ConversationPreview[] = [];
    grouped.forEach((msgs, cid) => {
      const sorted = [...msgs].sort(
        (a, b) =>
          new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
      );
      const lastMessage = sorted[0];
      
      previews.push({
        conversation_id: cid,
        customer_name: lastMessage.customer_name,
        customer_phone: lastMessage.customer_phone,
        lastMessage,
        messageCount: msgs.length,
      });
    });

    return previews.sort(
      (a, b) =>
        new Date(b.lastMessage.CreatedAt).getTime() -
        new Date(a.lastMessage.CreatedAt).getTime()
    );
  }, [messages]);

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const name = (conv.customer_name || "").toLowerCase();
      const phone = (conv.customer_phone || "").toLowerCase();
      const fromPhone = (conv.lastMessage.from_phone || "").toLowerCase();
      
      return name.includes(query) || phone.includes(query) || fromPhone.includes(query);
    });
  }, [conversations, searchQuery]);

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "עכשיו";
    if (diffMins < 60) return `לפני ${diffMins} דק'`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    
    return date.toLocaleDateString('he-IL', {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin: "500px", // Start loading 500px before reaching the bottom (early load)
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onLoadMore, hasMore, isLoadingMore]);

  return (
    <div className={`w-full md:w-[450px] bg-white border-r border-gray-200 flex flex-col shadow-modern-lg h-full ${className}`} dir="rtl">
      {/* Search Box */}
      <div className="p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 flex-shrink-0">
        <div className="relative">
          <svg className="absolute right-3 md:right-4 top-2.5 md:top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="חיפוש שיחות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 md:pr-11 pl-3 md:pl-4 py-2 md:py-3 bg-white border-2 border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm text-sm md:text-base"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              {searchQuery ? "לא נמצאו שיחות" : "אין שיחות עדיין"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv, index) => (
            <button
              key={conv.conversation_id}
              onClick={() => onSelect(conv.conversation_id)}
              className={`w-full px-3 md:px-4 py-3 md:py-4 border-b border-gray-100 transition-all duration-200 group ${
                selected === conv.conversation_id 
                  ? "bg-gradient-to-l from-purple-50 to-pink-50 border-l-4 border-l-purple-500" 
                  : "hover:bg-gray-50"
              }`}
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              <div className="flex items-center gap-3 md:gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg flex-shrink-0 ${
                  selected === conv.conversation_id
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                    : "bg-gradient-to-br from-purple-400 to-pink-400"
                }`}>
                  {(conv.customer_name || conv.customer_phone).charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 truncate text-sm md:text-base">
                      {conv.customer_name || conv.customer_phone}
                    </h3>
                    <span className="text-[10px] md:text-xs text-purple-600 font-medium mr-1 md:mr-2 flex-shrink-0">
                      {formatRelativeTime(conv.lastMessage.CreatedAt)}
                    </span>
                  </div>
                  
                  {conv.customer_name && (
                    <div className="text-[10px] md:text-xs text-gray-400 mb-1 flex items-center">
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {conv.customer_phone}
                    </div>
                  )}
                  
                  <p className="text-xs md:text-sm text-gray-600 truncate leading-relaxed">
                    {conv.lastMessage.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-1.5 md:mt-2">
                    <div className="inline-flex items-center px-2 py-0.5 md:py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] md:text-xs font-medium">
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span>{conv.messageCount} {conv.messageCount === 1 ? "הודעה" : "הודעות"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
        
        {/* Infinite Scroll Trigger & Loading Indicator */}
        {hasMore && (
          <div ref={loadMoreRef} className="p-4 text-center">
            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">טוען עוד שיחות...</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400">גלול למטה לטעינת עוד שיחות</div>
            )}
          </div>
        )}
        
        {/* No More Data Indicator */}
        {!hasMore && filteredConversations.length > 0 && (
          <div className="p-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-gray-500 font-medium">כל השיחות נטענו</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
