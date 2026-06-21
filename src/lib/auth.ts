import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev_secret_change_me"
);

export const AUTH_COOKIE = "legacy_admin_token";

export interface AdminTokenPayload {
  sub: string; // admin id
  email: string;
  name: string;
}

export async function signToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}

/**
 * Read the admin session from the request cookies (for use in route handlers
 * and server components). Returns null if not authenticated.
 */
export async function getSession(): Promise<AdminTokenPayload | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
