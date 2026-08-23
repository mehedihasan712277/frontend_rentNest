import { create } from "zustand";

import { api } from "@/lib/axios-client";

export interface CategoryProperty {
    title: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _count: {
        properties: number;
    };
    properties: CategoryProperty[];
}

export interface GetAllCategoriesResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: Category[];
}

interface CreateCategoryPayload {
    name: string;
    description?: string;
}

// The create endpoint only echoes back the fields it was given — no
// `_count`/`properties` yet, since a brand new category has no properties
// linked. We don't rely on `data` for anything other than the message, so
// this is intentionally narrower than `Category`.
interface CreateCategoryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        id: string;
        name: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

interface UpdateCategoryPayload {
    name: string;
    description: string;
}

interface UpdateCategoryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Category;
}

interface DeleteCategoryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: null;
}

/** Landlord info embedded in a property inside the single-category response. */
export interface CategoryPropertyLandlord {
    id: string;
    name: string;
    email: string;
}

/** Amenity info embedded in a property inside the single-category response. */
export interface CategoryPropertyAmenity {
    id: string;
    name: string;
    description: string;
}

/** A property as embedded in the single-category detail response. */
export interface CategoryPropertyDetail {
    id: string;
    landlordId: string;
    categoryId: string;
    title: string;
    description: string;
    location: string;
    price: number;
    area: number;
    thumbnail: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    _count: {
        reviews: number;
        amenities: number;
        rentalRequests: number;
    };
    landlord: CategoryPropertyLandlord;
    amenities: CategoryPropertyAmenity[];
}

/** Full shape of a single category, from the protected single-item endpoint. */
export interface CategoryDetail {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _count: {
        properties: number;
    };
    properties: CategoryPropertyDetail[];
}

interface GetSingleCategoryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: CategoryDetail;
}

/** The message returned by a create/update/delete call, shown in a dialog. */
interface OperationFeedback {
    message: string;
    variant: "success" | "error";
}

interface CategoryState {
    categories: Category[];
    /** true only on the very first load (no data on screen yet) */
    isLoading: boolean;
    /** true on subsequent fetches, e.g. the refetch after a delete */
    isRefetching: boolean;
    /** error from fetchCategories specifically, shown inline */
    fetchError: string | null;
    /** true while a create request is in flight */
    isCreating: boolean;
    /** id of the category currently being deleted, if any */
    deletingId: string | null;
    /** id of the category currently being updated, if any */
    updatingId: string | null;
    /** message from the last create/update/delete call, shown in a dialog */
    feedback: OperationFeedback | null;

    // Single-category details, used by the "details" dialog on each row.
    selectedCategory: CategoryDetail | null;
    isLoadingDetails: boolean;
    detailsError: string | null;

    fetchCategories: () => Promise<void>;
    createCategory: (payload: CreateCategoryPayload) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<boolean>;
    updateCategory: (
        id: string,
        payload: UpdateCategoryPayload,
    ) => Promise<boolean>;
    fetchCategoryDetails: (id: string) => Promise<void>;
    clearCategoryDetails: () => void;
    clearFeedback: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: false,
    isRefetching: false,
    fetchError: null,
    isCreating: false,
    deletingId: null,
    updatingId: null,
    feedback: null,

    selectedCategory: null,
    isLoadingDetails: false,
    detailsError: null,

    fetchCategories: async () => {
        const hasData = get().categories.length > 0;
        set(
            hasData
                ? { isRefetching: true, fetchError: null }
                : { isLoading: true, fetchError: null },
        );

        try {
            const res = await api.get<GetAllCategoriesResponse>("/categories");
            set({ categories: res.data.data });
        } catch (err) {
            set({
                fetchError:
                    err instanceof Error
                        ? err.message
                        : "Could not load categories.",
            });
        } finally {
            set({ isLoading: false, isRefetching: false });
        }
    },

    createCategory: async (payload) => {
        set({ isCreating: true });
        try {
            const res = await api.post<CreateCategoryResponse>(
                "/categories",
                payload,
            );
            await get().fetchCategories();
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
                            : "Could not create the category.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ isCreating: false });
        }
    },

    deleteCategory: async (id) => {
        set({ deletingId: id });
        try {
            const res = await api.delete<DeleteCategoryResponse>(
                `/categories/${id}`,
            );
            await get().fetchCategories();
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
                            : "Could not delete the category.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ deletingId: null });
        }
    },

    updateCategory: async (id, payload) => {
        set({ updatingId: id });
        try {
            const res = await api.put<UpdateCategoryResponse>(
                `/categories/${id}`,
                payload,
            );
            await get().fetchCategories();
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
                            : "Could not update the category.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ updatingId: null });
        }
    },

    fetchCategoryDetails: async (id) => {
        set({
            isLoadingDetails: true,
            detailsError: null,
            selectedCategory: null,
        });
        try {
            const res = await api.get<GetSingleCategoryResponse>(
                `/categories/${id}`,
            );
            set({ selectedCategory: res.data.data });
        } catch (err) {
            set({
                detailsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load category details.",
            });
        } finally {
            set({ isLoadingDetails: false });
        }
    },

    clearCategoryDetails: () =>
        set({ selectedCategory: null, detailsError: null }),

    clearFeedback: () => set({ feedback: null }),
}));
