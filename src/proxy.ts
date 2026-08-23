import { NextRequest, NextResponse } from "next/server";
import {
    verifyAccessToken,
    roleToDashboardPath,
    type UserRole,
    type AccessTokenPayload,
} from "@/lib/jwt";
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    ACCESS_TOKEN_MAX_AGE,
    LOGIN_PATH,
} from "@/lib/auth-config";

const API_BASE_URL = process.env.API_BASE_URL;

const AUTH_ONLY_PATHS = ["/auth/login", "/auth/register"];

function isPrivatePath(pathname: string) {
    return (
        pathname.startsWith("/dashboard") || pathname.startsWith("/checkout")
    );
}

function isAuthOnlyPath(pathname: string) {
    return AUTH_ONLY_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
}

/** Which role, if any, a /dashboard/* path is restricted to. */
function getRequiredRoleForPath(pathname: string): UserRole | null {
    if (pathname.startsWith("/dashboard/admin")) return "ADMIN";
    if (pathname.startsWith("/dashboard/landlord")) return "LANDLORD";
    if (pathname.startsWith("/dashboard/tenant")) return "TENANT";
    return null;
}

async function tryVerify(token: string): Promise<AccessTokenPayload | null> {
    try {
        return await verifyAccessToken(token);
    } catch {
        return null;
    }
}

/**
 * Calls the backend's refresh endpoint. It reads the refresh token from a
 * "refreshToken" cookie on ITS OWN domain, so we forward it manually here —
 * the browser never sends our frontend's refreshToken cookie to the API.
 */
async function refreshAccessToken(
    refreshToken: string,
): Promise<string | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
            method: "POST",
            headers: {
                Cookie: `refreshToken=${refreshToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) return null;

        const body = await res.json().catch(() => null);
        return body?.success ? (body.data?.accessToken ?? null) : null;
    } catch {
        return null;
    }
}

function withRefreshedCookie(response: NextResponse, accessToken: string) {
    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    return response;
}

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const wantsPrivate = isPrivatePath(pathname);
    const wantsAuthOnly = isAuthOnlyPath(pathname);

    if (!wantsPrivate && !wantsAuthOnly) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    let payload = accessToken ? await tryVerify(accessToken) : null;
    let refreshedAccessToken: string | null = null;

    // Access token missing/expired/invalid — try the refresh token once.
    if (!payload && refreshToken) {
        refreshedAccessToken = await refreshAccessToken(refreshToken);
        if (refreshedAccessToken) {
            payload = await tryVerify(refreshedAccessToken);
        }
    }

    const isAuthenticated = !!payload;

    // Logged-in users shouldn't see /auth/login or /auth/register.
    if (wantsAuthOnly) {
        if (isAuthenticated) {
            const response = NextResponse.redirect(
                new URL(roleToDashboardPath(payload!.role), request.url),
            );
            return refreshedAccessToken
                ? withRefreshedCookie(response, refreshedAccessToken)
                : response;
        }
        return NextResponse.next();
    }

    // Private route, no valid session (refresh also failed or absent) -> login.
    if (!isAuthenticated) {
        const response = NextResponse.redirect(
            new URL(LOGIN_PATH, request.url),
        );
        response.cookies.delete(ACCESS_TOKEN_COOKIE);
        response.cookies.delete(REFRESH_TOKEN_COOKIE);
        return response;
    }

    // Authenticated — enforce that each role only sees its own dashboard.
    const requiredRole = getRequiredRoleForPath(pathname);
    if (requiredRole && payload!.role !== requiredRole) {
        const response = NextResponse.redirect(
            new URL(roleToDashboardPath(payload!.role), request.url),
        );
        return refreshedAccessToken
            ? withRefreshedCookie(response, refreshedAccessToken)
            : response;
    }

    const response = NextResponse.next();
    return refreshedAccessToken
        ? withRefreshedCookie(response, refreshedAccessToken)
        : response;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/checkout/:path*",
        "/auth/login",
        "/auth/register",
    ],
};
