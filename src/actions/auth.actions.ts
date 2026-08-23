"use server";

import { redirect } from "next/navigation";
import {
    clearAuthCookies,
    getAccessToken,
    setAuthCookies,
} from "@/lib/auth-cookies";
import { verifyAccessToken, roleToDashboardPath } from "@/lib/jwt";
import { LOGIN_PATH } from "@/lib/auth-config";

const API_BASE_URL = process.env.API_BASE_URL;

export interface LoginState {
    error?: string;
    fieldErrors?: {
        email?: string;
        password?: string;
    };
}

interface LoginApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        accessToken: string;
        refreshToken: string;
    };
}

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function loginAction(
    _prevState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const fieldErrors: LoginState["fieldErrors"] = {};
    if (!email) fieldErrors.email = "Email is required.";
    else if (!isValidEmail(email))
        fieldErrors.email = "Enter a valid email address.";
    if (!password) fieldErrors.password = "Password is required.";

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    let payload: LoginApiResponse | null;

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
        });

        payload = await res.json().catch(() => null);

        if (!res.ok || !payload?.success || !payload.data) {
            return {
                error:
                    payload?.message ||
                    "Invalid email or password. Please try again.",
            };
        }
    } catch {
        return {
            error: "Could not reach the server. Please try again in a moment.",
        };
    }

    const { accessToken, refreshToken } = payload.data;

    await setAuthCookies(accessToken, refreshToken);

    let redirectPath = "/dashboard/tenant";
    try {
        const decoded = await verifyAccessToken(accessToken);
        redirectPath = roleToDashboardPath(decoded.role);
    } catch {
        // Fall back rather than blocking a login the backend already approved.
    }

    redirect(redirectPath);
}

export async function logoutAction() {
    const accessToken = await getAccessToken();

    if (accessToken) {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: "POST",
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                cache: "no-store",
            });
        } catch {
            // Ignore — local logout proceeds either way.
        }
    }

    await clearAuthCookies();
    redirect(LOGIN_PATH);
}
