import { create } from "zustand";

import { api } from "@/lib/axios-client";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type RentalRequestStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "DELETED";

/** Core fields present on every rental request, regardless of endpoint. */
interface RentalRequestCore {
    id: string;
    tenantId: string;
    propertyId: string;
    landlordId: string;
    message: string;
    status: RentalRequestStatus;
    stripeSessionId: string | null;
    stripeSubscriptionId: string | null;
    createdAt: string;
    updatedAt: string;
}

/** The tenant's own view of a request they sent (my-sent-request). */
export interface SentRentalRequest extends RentalRequestCore {
    property: {
        title: string;
        landlord: {
            name: string;
        };
        price: number;
        area: number;
    };
}

/** A landlord's view of a request made against one of their properties. */
export interface ReceivedRentalRequest extends RentalRequestCore {
    tenant: {
        name: string;
    };
    property: {
        title: string;
    };
}

/** The admin's view of every request in the system. */
export interface AdminRentalRequest extends RentalRequestCore {
    tenant: {
        name: string;
    };
    property: {
        title: string;
        area: number;
        price: number;
        landlord: {
            name: string;
        };
    };
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

interface CreateRentalRequestPayload {
    propertyId: string;
    message: string;
}

interface UpdateRentalRequestStatusPayload {
    status: RentalRequestStatus;
}

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

interface CreateRentalRequestResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: RentalRequestCore;
}

interface GetMySentRequestsResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: SentRentalRequest[];
}

interface TenantDeleteRequestResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: RentalRequestCore;
}

interface GetAllRequestsResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: AdminRentalRequest[];
}

interface AdminDeleteRequestResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: null;
}

interface GetRequestsToMeResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: ReceivedRentalRequest[];
}

interface UpdateRentalRequestStatusResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: RentalRequestCore;
}

/** The message returned by a mutating call, shown in a dialog. */
interface OperationFeedback {
    message: string;
    variant: "success" | "error";
}

/** Pulls a readable message off an axios error, falling back gracefully. */
function getErrorMessage(err: unknown, fallback: string): string {
    if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message === "string"
    ) {
        return (err as { response: { data: { message: string } } }).response
            .data.message;
    }
    if (err instanceof Error) return err.message;
    return fallback;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface RentalRequestState {
    // ---- tenant: my-sent-request ----
    sentRequests: SentRentalRequest[];
    isLoadingSent: boolean;
    isRefetchingSent: boolean;
    fetchSentError: string | null;

    // ---- tenant: create ----
    isCreating: boolean;

    // ---- tenant: delete (soft delete, status -> DELETED) ----
    tenantDeletingId: string | null;

    // ---- landlord: rental-request-to-me ----
    receivedRequests: ReceivedRentalRequest[];
    isLoadingReceived: boolean;
    isRefetchingReceived: boolean;
    fetchReceivedError: string | null;

    // ---- landlord: update status ----
    updatingStatusId: string | null;

    // ---- admin: all requests ----
    allRequests: AdminRentalRequest[];
    isLoadingAll: boolean;
    isRefetchingAll: boolean;
    fetchAllError: string | null;

    // ---- admin: delete ----
    adminDeletingId: string | null;

    /** message from the last mutating call, shown in a dialog */
    feedback: OperationFeedback | null;

    // ---- tenant actions ----
    createRentalRequest: (
        payload: CreateRentalRequestPayload,
    ) => Promise<boolean>;
    fetchMySentRequests: () => Promise<void>;
    tenantDeleteRequest: (id: string) => Promise<boolean>;

    // ---- landlord actions ----
    fetchRequestsToMe: () => Promise<void>;
    updateRentalRequestStatus: (
        id: string,
        status: RentalRequestStatus,
    ) => Promise<boolean>;

    // ---- admin actions ----
    fetchAllRentalRequests: () => Promise<void>;
    adminDeleteRequest: (id: string) => Promise<boolean>;

    clearFeedback: () => void;
}

export const useRentalRequestStore = create<RentalRequestState>((set, get) => ({
    sentRequests: [],
    isLoadingSent: false,
    isRefetchingSent: false,
    fetchSentError: null,

    isCreating: false,

    tenantDeletingId: null,

    receivedRequests: [],
    isLoadingReceived: false,
    isRefetchingReceived: false,
    fetchReceivedError: null,

    updatingStatusId: null,

    allRequests: [],
    isLoadingAll: false,
    isRefetchingAll: false,
    fetchAllError: null,

    adminDeletingId: null,

    feedback: null,

    // -------------------------------------------------------------
    // Tenant
    // -------------------------------------------------------------

    createRentalRequest: async (payload) => {
        set({ isCreating: true });
        try {
            const res = await api.post<CreateRentalRequestResponse>(
                "/rental-requests",
                payload,
            );
            // Re-sync with the server so the new request shows up in
            // the tenant's sent-requests list with its nested property data.
            await get().fetchMySentRequests();
            set({
                feedback: { message: res.data.message, variant: "success" },
            });
            return true;
        } catch (err) {
            set({
                feedback: {
                    message: getErrorMessage(
                        err,
                        "Could not send the rental request.",
                    ),
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ isCreating: false });
        }
    },

    fetchMySentRequests: async () => {
        const hasData = get().sentRequests.length > 0;
        set(
            hasData
                ? { isRefetchingSent: true, fetchSentError: null }
                : { isLoadingSent: true, fetchSentError: null },
        );

        try {
            const res = await api.get<GetMySentRequestsResponse>(
                "/rental-requests/my-sent-request",
            );
            set({ sentRequests: res.data.data });
        } catch (err) {
            set({
                fetchSentError: getErrorMessage(
                    err,
                    "Could not load your sent requests.",
                ),
            });
        } finally {
            set({ isLoadingSent: false, isRefetchingSent: false });
        }
    },

    tenantDeleteRequest: async (id) => {
        set({ tenantDeletingId: id });
        try {
            const res = await api.put<TenantDeleteRequestResponse>(
                `/rental-requests/tenant-delete/${id}`,
            );
            await get().fetchMySentRequests();
            set({
                feedback: { message: res.data.message, variant: "success" },
            });
            return true;
        } catch (err) {
            set({
                feedback: {
                    message: getErrorMessage(
                        err,
                        "Could not delete the rental request.",
                    ),
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ tenantDeletingId: null });
        }
    },

    // -------------------------------------------------------------
    // Landlord
    // -------------------------------------------------------------

    fetchRequestsToMe: async () => {
        const hasData = get().receivedRequests.length > 0;
        set(
            hasData
                ? { isRefetchingReceived: true, fetchReceivedError: null }
                : { isLoadingReceived: true, fetchReceivedError: null },
        );

        try {
            const res = await api.get<GetRequestsToMeResponse>(
                "/rental-requests/rental-request-to-me",
            );
            set({ receivedRequests: res.data.data });
        } catch (err) {
            set({
                fetchReceivedError: getErrorMessage(
                    err,
                    "Could not load requests to your properties.",
                ),
            });
        } finally {
            set({ isLoadingReceived: false, isRefetchingReceived: false });
        }
    },

    updateRentalRequestStatus: async (id, status) => {
        set({ updatingStatusId: id });
        try {
            const payload: UpdateRentalRequestStatusPayload = { status };
            const res = await api.put<UpdateRentalRequestStatusResponse>(
                `/rental-requests/${id}`,
                payload,
            );
            await get().fetchRequestsToMe();
            set({
                feedback: { message: res.data.message, variant: "success" },
            });
            return true;
        } catch (err) {
            set({
                feedback: {
                    message: getErrorMessage(
                        err,
                        "Could not update the request status.",
                    ),
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ updatingStatusId: null });
        }
    },

    // -------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------

    fetchAllRentalRequests: async () => {
        const hasData = get().allRequests.length > 0;
        set(
            hasData
                ? { isRefetchingAll: true, fetchAllError: null }
                : { isLoadingAll: true, fetchAllError: null },
        );

        try {
            const res =
                await api.get<GetAllRequestsResponse>("/rental-requests");
            set({ allRequests: res.data.data });
        } catch (err) {
            set({
                fetchAllError: getErrorMessage(
                    err,
                    "Could not load rental requests.",
                ),
            });
        } finally {
            set({ isLoadingAll: false, isRefetchingAll: false });
        }
    },

    adminDeleteRequest: async (id) => {
        set({ adminDeletingId: id });
        try {
            const res = await api.delete<AdminDeleteRequestResponse>(
                `/rental-requests/${id}`,
            );
            await get().fetchAllRentalRequests();
            set({
                feedback: { message: res.data.message, variant: "success" },
            });
            return true;
        } catch (err) {
            set({
                feedback: {
                    message: getErrorMessage(
                        err,
                        "Could not delete the rental request.",
                    ),
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ adminDeletingId: null });
        }
    },

    clearFeedback: () => set({ feedback: null }),
}));
