import { jwtVerify, type JWTPayload } from "jose";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface AccessTokenPayload extends JWTPayload {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status?: string; // present on login, absent on a refreshed token
}

function getAccessSecretKey() {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
    return new TextEncoder().encode(secret);
}

/** Verifies the access token's signature and returns its decoded payload. */
export async function verifyAccessToken(
    token: string,
): Promise<AccessTokenPayload> {
    const { payload } = await jwtVerify<AccessTokenPayload>(
        token,
        getAccessSecretKey(),
    );
    return payload;
}

/** Maps a user role to their dashboard route. */
export function roleToDashboardPath(role: UserRole): string {
    switch (role) {
        case "ADMIN":
            return "/dashboard/admin";
        case "LANDLORD":
            return "/dashboard/landlord";
        case "TENANT":
            return "/dashboard/tenant";
        default:
            return "/dashboard/tenant";
    }
}
