import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // Update session expiration
  const sessionRes = await updateSession(request);

  const currentUser = request.cookies.get("session")?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  
  if (isAuthRoute) {
    if (currentUser) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!currentUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return sessionRes || NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
