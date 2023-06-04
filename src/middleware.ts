import { parseSessionCookie } from "@/session";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = parseSessionCookie(request.cookies);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl).toString());
  }

  return NextResponse.next();

  // const agent = new BskyAgent({
  //   service: session.service,
  // });
  // agent.service = new URL(session.service);

  // await agent.resumeSession(session.atp);

  // const cookie = btoa(JSON.stringify(agent.session));
  // console.log("cookie", cookie);

  // // FIXME: Need to update request headers to include new cookie
  // return NextResponse.next({
  //   headers: {
  //     "Set-Cookie": `bsky-session=${cookie}; Path=/; HttpOnly; SameSite=Lax`,
  //   },
  // });
}

export const config = {
  matcher: ["/", "/home/:path*"],
};
