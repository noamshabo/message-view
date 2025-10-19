import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // דפים שדורשים אוטנטיקציה
  const protectedPaths = ["/", "/conversation"];
  
  // בדוק אם הנתיב המבוקש מוגן
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + "/")
  );

  // אם הדף מוגן והמשתמש לא מחובר, הפנה לדף התחברות
  if (isProtectedPath && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

// הגדר אילו נתיבים ה-middleware יפעל עליהם
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};

