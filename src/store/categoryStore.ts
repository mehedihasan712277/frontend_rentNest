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

interface DeleteCategoryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: null;
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

interface CategoryState {
    categories: Category[];
    /** true only on the very first load (no data on screen yet) */
    isLoading: boolean;
    /** true on subsequent fetches, e.g. the refetch after a delete */
    isRefetching: boolean;
    error: string | null;
    /** id of the category currently being deleted, if any */
    deletingId: string | null;
    /** id of the category currently being updated, if any */
    updatingId: string | null;

    fetchCategories: () => Promise<void>;
    addCategory: (category: Category) => void;
    deleteCategory: (id: string) => Promise<boolean>;
    updateCategory: (
        id: string,
        payload: UpdateCategoryPayload,
    ) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: false,
    isRefetching: false,
    error: null,
    deletingId: null,
    updatingId: null,

    fetchCategories: async () => {
        const hasData = get().categories.length > 0;
        set(
            hasData
                ? { isRefetching: true, error: null }
                : { isLoading: true, error: null },
        );

        try {
            const res = await api.get<GetAllCategoriesResponse>("/categories");
            set({ categories: res.data.data });
        } catch (err) {
            set({
                error:
                    err instanceof Error
                        ? err.message
                        : "Could not load categories.",
            });
        } finally {
            set({ isLoading: false, isRefetching: false });
        }
    },

    // Optimistically drop a freshly created category into the list so the
    // UI updates instantly after CreateCategoryForm posts it.
    addCategory: (category) => {
        set((state) => ({ categories: [category, ...state.categories] }));
    },

    deleteCategory: async (id) => {
        set({ deletingId: id, error: null });
        try {
            await api.delete<DeleteCategoryResponse>(`/categories/${id}`);
            // Re-sync with the server instead of just splicing locally,
            // so counts/ordering stay accurate.
            await get().fetchCategories();
            return true;
        } catch (err) {
            set({
                error:
                    err instanceof Error
                        ? err.message
                        : "Could not delete the category.",
            });
            return false;
        } finally {
            set({ deletingId: null });
        }
    },

    updateCategory: async (id, payload) => {
        set({ updatingId: id, error: null });
        try {
            await api.put<UpdateCategoryResponse>(`/categories/${id}`, payload);
            // Re-sync with the server instead of patching locally, so any
            // server-side derived fields (e.g. updatedAt) stay accurate.
            await get().fetchCategories();
            return true;
        } catch (err) {
            set({
                error:
                    err instanceof Error
                        ? err.message
                        : "Could not update the category.",
            });
            return false;
        } finally {
            set({ updatingId: null });
        }
    },
}));
