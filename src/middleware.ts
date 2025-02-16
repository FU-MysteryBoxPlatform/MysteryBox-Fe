import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const { cookies } = request;
  const url = new URL(request.url);

  const accessToken = cookies.get("ACCESS_TOKEN")?.value || "";

  if (accessToken && url.pathname === "/login") {
    return NextResponse.redirect(`${url.origin}/`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
