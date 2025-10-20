"use client";

import { useState, useEffect } from "react";
import { Message } from "@/types";
import ConversationsList from "@/components/ConversationsList";
import Chat from "@/components/Chat";
import UserMenu from "@/components/UserMenu";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await fetch("/api/messages?limit=500");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMessages();
  };

  // Handle conversation selection
  const handleSelectConversation = (cid: string) => {
    setSelectedConversationId(cid);
    setShowMobileChat(true); // Show chat on mobile when conversation is selected
  };
  
  // Handle back to conversations list on mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  // Filter messages for selected conversation
  const conversationMessages = selectedConversationId
    ? messages.filter((msg) => msg.conversation_id === selectedConversationId)
    : [];

  // Get conversation details
  const conversationDetails = conversationMessages.length > 0 
    ? conversationMessages[0] 
    : null;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="gradient-header shadow-modern-lg">
        <div className="px-3 md:px-6 py-3 md:py-5 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse">
            {/* Back button on mobile when chat is open */}
            {showMobileChat && (
              <button
                onClick={handleBackToList}
                className="md:hidden w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-lg">
              מערכת שיחות
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <UserMenu />
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="px-3 md:px-5 py-2 md:py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none font-medium text-sm md:text-base"
            >
              <div className="flex items-center space-x-1.5 md:space-x-2 space-x-reverse">
                <svg className={`w-4 h-4 md:w-5 md:h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">{isRefreshing ? "מרענן..." : "רענן"}</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200 px-3 md:px-6 py-3 md:py-4 animate-slide-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-900 text-sm md:text-base">שגיאה</p>
                <p className="text-xs md:text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg font-medium text-sm"
            >
              נסה שוב
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <div className="text-center">
              <div className="inline-block w-12 h-12 md:w-16 md:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium text-base md:text-lg">טוען הודעות...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Right Sidebar - Conversations List */}
            <ConversationsList
              messages={messages}
              onSelect={handleSelectConversation}
              selected={selectedConversationId || undefined}
              className={`${showMobileChat ? 'hidden md:flex' : 'flex'}`}
            />

            {/* Left Panel - Chat View */}
            <div className={`flex-1 flex-col ${showMobileChat ? 'flex' : 'hidden md:flex'}`} dir="rtl">
              {selectedConversationId ? (
                <>
                  {/* Conversation Header */}
                  {conversationDetails && (
                    <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 shadow-md">
                      <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-white font-bold text-base md:text-lg">
                            {(conversationDetails.customer_name || conversationDetails.customer_phone).charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base md:text-xl font-bold text-gray-900 truncate">
                            {conversationDetails.customer_name || conversationDetails.customer_phone}
                          </h2>
                          <div className="text-xs md:text-sm text-gray-500 mt-0.5 flex items-center space-x-1.5 md:space-x-2 space-x-reverse">
                            <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="truncate">{conversationDetails.customer_phone}</span>
                            {conversationDetails.from_phone && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline truncate">{conversationDetails.from_phone}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional info */}
                      {(conversationDetails.date_of_meeting || conversationDetails.customer_start_hour) && (
                        <div className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
                          {conversationDetails.date_of_meeting && (
                            <div className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 bg-purple-50 text-purple-700 rounded-full text-xs md:text-sm">
                              <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{conversationDetails.date_of_meeting}</span>
                            </div>
                          )}
                          {conversationDetails.customer_start_hour && (
                            <div className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 bg-pink-50 text-pink-700 rounded-full text-xs md:text-sm">
                              <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{conversationDetails.customer_start_hour}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chat Messages */}
                  <Chat items={conversationMessages} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-purple-50">
                  <div className="text-center animate-slide-in">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">בחר שיחה להתחלה</h3>
                    <p className="text-gray-500">לחץ על שיחה מהרשימה כדי לצפות בהודעות</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
