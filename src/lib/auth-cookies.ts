import "server-only";
import { cookies } from "next/headers";
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    ACCESS_TOKEN_MAX_AGE,
    REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth-config";

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };

/** Stores the access + refresh tokens as httpOnly cookies. */
export async function setAuthCookies(
    accessToken: string,
    refreshToken: string,
) {
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
}

export async function getAccessToken() {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
