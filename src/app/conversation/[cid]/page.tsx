"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Message } from "@/types";
import ConversationsList from "@/components/ConversationsList";
import Chat from "@/components/Chat";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.cid as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      console.error("Error fetching messages:", err);
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
    router.push(`/conversation/${encodeURIComponent(cid)}`);
  };

  // Handle back to home
  const handleBackHome = () => {
    router.push("/");
  };

  // Filter messages for selected conversation
  const conversationMessages = messages.filter(
    (msg) => msg.conversation_id === conversationId
  );

  // Get conversation details
  const conversationDetails = conversationMessages.length > 0
    ? conversationMessages[0]
    : null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackHome}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Back to all conversations"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Conversations Viewer
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading messages...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Conversations List */}
            <ConversationsList
              messages={messages}
              onSelect={handleSelectConversation}
              selected={conversationId}
            />

            {/* Right Panel - Chat View */}
            <div className="flex-1 flex flex-col bg-white">
              {conversationDetails ? (
                <>
                  {/* Conversation Header */}
                  <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {conversationDetails.customer_name || conversationDetails.customer_phone}
                    </h2>
                    <div className="text-sm text-gray-600 mt-1">
                      {conversationDetails.customer_phone}
                      {conversationDetails.from_phone && (
                        <span className="ml-2">• {conversationDetails.from_phone}</span>
                      )}
                    </div>
                    
                    {/* Additional info if available */}
                    {(conversationDetails.date_of_meeting || conversationDetails.customer_start_hour) && (
                      <div className="text-sm text-gray-500 mt-2 space-y-1">
                        {conversationDetails.date_of_meeting && (
                          <div>
                            <span className="font-medium">Meeting Date:</span>{" "}
                            {conversationDetails.date_of_meeting}
                          </div>
                        )}
                        {conversationDetails.customer_start_hour && (
                          <div>
                            <span className="font-medium">Start Time:</span>{" "}
                            {conversationDetails.customer_start_hour}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chat Messages */}
                  <Chat items={conversationMessages} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-lg">Conversation not found</p>
                    <button
                      onClick={handleBackHome}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Go to Home
                    </button>
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

