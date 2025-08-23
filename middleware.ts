// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const session = await auth(); // ye user ka session return karega

  const url = req.nextUrl.clone();

  // protected routes
  if (url.pathname.startsWith("/attempt")) {
    if (!session) {
      const loginUrl = new URL("/", req.url);
      loginUrl.searchParams.set("callbackUrl", url.pathname + url.search); 
      // jaise /attempt/123?callbackUrl=/attempt/123
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
