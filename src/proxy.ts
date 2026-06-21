import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE = "legacy_admin_token";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_secret_change_me");

async function isAuthed(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin API routes
  if (pathname.startsWith("/api/admin")) {
    if (!(await isAuthed(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protect admin pages (allow the login page through)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // If already logged in, redirect to dashboard
      if (await isAuthed(req)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    if (!(await isAuthed(req))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
