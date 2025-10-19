import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// רשימת אימיילים מותרים - הוסף כאן את האימיילים שרק להם תהיה גישה
const ALLOWED_EMAILS = [
  "noamshabo1@gmail.com", // החלף בכתובות האימייל שלך
  // הוסף עוד אימיילים כאן
];

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // בדיקה אם האימייל נמצא ברשימת המותרים
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return true;
      }
      
      // אם האימייל לא ברשימה, מנע כניסה
      console.log(`Access denied for email: ${user.email}`);
      return false;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnConversation = nextUrl.pathname.startsWith("/conversation");
      const isOnHome = nextUrl.pathname === "/";
      
      if (isOnConversation || isOnHome) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true;
      }
      
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;

