import axios from "axios";

/**
 * Calls OUR OWN /api/proxy/* route handler (same-origin), never the backend
 * directly. The browser automatically sends our httpOnly accessToken cookie
 * along with same-origin requests — axios/client JS never sees the token.
 */
export const api = axios.create({
    baseURL: "/api/proxy",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            if (
                error.response?.status === 401 &&
                typeof window !== "undefined"
            ) {
                window.location.href = "/auth/login";
            }
            const message =
                (error.response?.data as { message?: string } | undefined)
                    ?.message ?? "Something went wrong. Please try again.";
            return Promise.reject(new Error(message));
        }
        return Promise.reject(
            new Error("Could not reach the server. Please try again."),
        );
    },
);
