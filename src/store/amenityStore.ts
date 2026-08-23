import { create } from "zustand";

import { api } from "@/lib/axios-client";

export interface AmenityProperty {
    title: string;
}

/** Shape of an amenity as returned by the public list endpoint. */
export interface Amenity {
    id: string;
    name: string;
    description: string;
    _count: {
        properties: number;
    };
    properties: AmenityProperty[];
}

export interface GetAllAmenitiesResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: Amenity[];
}

interface CreateAmenityPayload {
    name: string;
    description?: string;
}

// Mirrors the create endpoint's response: no `_count`/`properties` yet since
// a brand new amenity has nothing linked. Only used for its `message`.
interface CreateAmenityResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        id: string;
        name: string;
        description: string;
        creatorId: string;
        createdAt: string;
        updatedAt: string;
    };
}

interface DeleteAmenityResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: null;
}

/** A property as embedded in the single-amenity detail response. */
export interface AmenityPropertyDetail {
    id: string;
    landlordId: string;
    categoryId: string;
    title: string;
    description: string;
    location: string;
    price: number;
    area: number;
    thumbnail: string;
    stripeProductId: string;
    stripePriceId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface AmenityCreator {
    name: string;
    email: string;
    profile: {
        bio: string | null;
    };
}

/** Full shape of a single amenity, from the protected single-item endpoint. */
export interface AmenityDetail {
    id: string;
    name: string;
    description: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    properties: AmenityPropertyDetail[];
    _count: {
        properties: number;
    };
    creator: AmenityCreator;
}

interface GetSingleAmenityResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: AmenityDetail;
}

/** The message returned by a create/delete call, shown in a dialog. */
interface OperationFeedback {
    message: string;
    variant: "success" | "error";
}

interface AmenityState {
    amenities: Amenity[];
    /** true only on the very first load (no data on screen yet) */
    isLoading: boolean;
    /** true on subsequent fetches, e.g. the refetch after a delete */
    isRefetching: boolean;
    /** error from fetchAmenities specifically, shown inline */
    fetchError: string | null;
    /** true while a create request is in flight */
    isCreating: boolean;
    /** id of the amenity currently being deleted, if any */
    deletingId: string | null;
    /** message from the last create/delete call, shown in a dialog */
    feedback: OperationFeedback | null;

    // Single-amenity details, used by the "details" dialog on each row.
    selectedAmenity: AmenityDetail | null;
    isLoadingDetails: boolean;
    detailsError: string | null;

    fetchAmenities: () => Promise<void>;
    createAmenity: (payload: CreateAmenityPayload) => Promise<boolean>;
    deleteAmenity: (id: string) => Promise<boolean>;
    fetchAmenityDetails: (id: string) => Promise<void>;
    clearAmenityDetails: () => void;
    clearFeedback: () => void;
}

export const useAmenityStore = create<AmenityState>((set, get) => ({
    amenities: [],
    isLoading: false,
    isRefetching: false,
    fetchError: null,
    isCreating: false,
    deletingId: null,
    feedback: null,

    selectedAmenity: null,
    isLoadingDetails: false,
    detailsError: null,

    fetchAmenities: async () => {
        const hasData = get().amenities.length > 0;
        set(
            hasData
                ? { isRefetching: true, fetchError: null }
                : { isLoading: true, fetchError: null },
        );

        try {
            const res = await api.get<GetAllAmenitiesResponse>("/amenities");
            set({ amenities: res.data.data });
        } catch (err) {
            set({
                fetchError:
                    err instanceof Error
                        ? err.message
                        : "Could not load amenities.",
            });
        } finally {
            set({ isLoading: false, isRefetching: false });
        }
    },

    createAmenity: async (payload) => {
        set({ isCreating: true });
        try {
            const res = await api.post<CreateAmenityResponse>(
                "/amenities",
                payload,
            );
            // Re-sync with the server: the create response doesn't include
            // `_count`/`properties`, and a full refetch keeps ordering
            // consistent with everything else in the list.
            await get().fetchAmenities();
            set({
                feedback: { message: res.data.message, variant: "success" },
            });
            return true;
        } catch (err) {
            set({
                feedback: {
                    message:
                        err instanceof Error
                            ? err.message
                            : "Could not create the amenity.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ isCreating: false });
        }
    },

    deleteAmenity: async (id) => {
        set({ deletingId: id });
        try {
            const res = await api.delete<DeleteAmenityResponse>(
                `/amenities/${id}`,
            );
            await get().fetchAmenities();
            set({
                feedback: { message: res.data.message, variant: "success" },
            });
            return true;
        } catch (err) {
            set({
                feedback: {
                    message:
                        err instanceof Error
                            ? err.message
                            : "Could not delete the amenity.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ deletingId: null });
        }
    },

    fetchAmenityDetails: async (id) => {
        set({
            isLoadingDetails: true,
            detailsError: null,
            selectedAmenity: null,
        });
        try {
            const res = await api.get<GetSingleAmenityResponse>(
                `/amenities/${id}`,
            );
            set({ selectedAmenity: res.data.data });
        } catch (err) {
            set({
                detailsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load amenity details.",
            });
        } finally {
            set({ isLoadingDetails: false });
        }
    },

    clearAmenityDetails: () =>
        set({ selectedAmenity: null, detailsError: null }),

    clearFeedback: () => set({ feedback: null }),
}));
