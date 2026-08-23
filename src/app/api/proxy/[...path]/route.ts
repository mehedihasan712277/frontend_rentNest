import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    ACCESS_TOKEN_MAX_AGE,
} from "@/lib/auth-config";

const API_BASE_URL = process.env.API_BASE_URL;

async function tryVerify(token: string) {
    try {
        return await verifyAccessToken(token);
    } catch {
        return null;
    }
}

/** Same refresh call used in proxy.ts — forwards the refresh cookie manually. */
async function refreshAccessToken(
    refreshToken: string,
): Promise<string | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${refreshToken}` },
            cache: "no-store",
        });
        if (!res.ok) return null;
        const body = await res.json().catch(() => null);
        return body?.success ? (body.data?.accessToken ?? null) : null;
    } catch {
        return null;
    }
}

async function forwardToBackend(
    request: NextRequest,
    path: string,
    accessToken: string,
) {
    const url = new URL(`${API_BASE_URL}/api/${path}`);
    url.search = request.nextUrl.search;

    const method = request.method;
    const hasBody = !["GET", "HEAD"].includes(method);

    return fetch(url.toString(), {
        method,
        headers: {
            "Content-Type":
                request.headers.get("content-type") ?? "application/json",
            // Your backend's auth() middleware reads either the accessToken cookie
            // OR an Authorization: Bearer header — we use the header since this
            // request originates from our server, not the browser.
            Authorization: `Bearer ${accessToken}`,
        },
        body: hasBody ? await request.text() : undefined,
        cache: "no-store",
    });
}

async function handler(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path: pathSegments } = await params;
    const path = pathSegments.join("/");

    const accessTokenCookie = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshTokenCookie = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    let accessToken =
        accessTokenCookie && (await tryVerify(accessTokenCookie))
            ? accessTokenCookie
            : null;
    let refreshedToken: string | null = null;

    if (!accessToken && refreshTokenCookie) {
        refreshedToken = await refreshAccessToken(refreshTokenCookie);
        if (refreshedToken && (await tryVerify(refreshedToken))) {
            accessToken = refreshedToken;
        }
    }

    if (!accessToken) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "You are not logged in. Please log in to access this resource",
            },
            { status: 401 },
        );
    }

    const backendRes = await forwardToBackend(request, path, accessToken);
    const data = await backendRes.json().catch(() => null);

    const response = NextResponse.json(
        data ?? { success: false, message: "Invalid response from server" },
        { status: backendRes.status },
    );

    // Persist a refreshed access token for next time.
    if (refreshedToken) {
        const isProd = process.env.NODE_ENV === "production";
        response.cookies.set(ACCESS_TOKEN_COOKIE, refreshedToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: ACCESS_TOKEN_MAX_AGE,
        });
    }

    return response;
}

export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
};
