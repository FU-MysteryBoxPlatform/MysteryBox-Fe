import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const authenticatedUrls = [
  "/profile",
  "/my-collection",
  "/my-product",
  "/messages",
  "/my-exchange",
  "/my-request-sell",
  "/my-transaction",
  "/orders",
  "/withdraw-request",
];

export default function middleware(request: NextRequest) {
  const { cookies } = request;
  const url = new URL(request.url);

  const accessToken = cookies.get("ACCESS_TOKEN")?.value || "";

  // Navigate to login page if not authenticated
  if (!accessToken && authenticatedUrls.includes(url.pathname)) {
    return NextResponse.redirect(`${url.origin}/login`);
  }
  if (accessToken && url.pathname === "/login") {
    return NextResponse.redirect(`${url.origin}/`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
