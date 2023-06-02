import { parseSessionCookie } from "@/session";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = parseSessionCookie(request.cookies);
  console.log(session);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl).toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};
