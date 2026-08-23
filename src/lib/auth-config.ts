export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24; // 1 day, in seconds
export const REFRESH_TOKEN_MAX_AGE = ACCESS_TOKEN_MAX_AGE * 7; // 7 days

export const LOGIN_PATH = "/auth/login";
