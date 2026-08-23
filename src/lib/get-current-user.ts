import "server-only";
import { cookies } from "next/headers";
import { verifyAccessToken, type AccessTokenPayload } from "@/lib/jwt";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-config";

/**
 * Reads and verifies the access token cookie in a Server Component,
 * Server Action, or Route Handler. Returns null if missing/invalid.
 * Does NOT attempt a refresh — refreshing only happens in proxy.ts,
 * before the page is ever rendered.
 */
export async function getCurrentUser(): Promise<AccessTokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!token) return null;

    try {
        return await verifyAccessToken(token);
    } catch {
        return null;
    }
}
