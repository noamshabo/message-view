"use client";

import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="group flex items-center gap-3 md:gap-4 bg-white/95 backdrop-blur-md px-3 md:px-5 py-2 md:py-3 rounded-2xl shadow-lg hover:shadow-xl border-2 border-purple-100 hover:border-purple-200 transition-all duration-300">
      {session.user.image && (
        <div className="relative">
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full ring-2 ring-purple-300 group-hover:ring-purple-400 transition-all"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      )}
      <div className="hidden sm:flex flex-col flex-1 min-w-0">
        <span className="text-sm md:text-base font-bold text-gray-900 truncate">
          {session.user.name}
        </span>
        <span className="text-xs text-gray-500 truncate">{session.user.email}</span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
      >
        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="hidden md:inline">יציאה</span>
      </button>
    </div>
  );
}

