import { create } from "zustand";
import { api } from "@/lib/axios-client";

export type ReviewStatus = "APPROVED" | "CANCELED";

// --- GET /api/reviews (admin: all reviews) ---
export interface ReviewLandlord {
    name: string;
    email: string;
}

export interface ReviewCategory {
    name: string;
}

export interface ReviewPropertySummary {
    title: string;
    description: string;
    landlord: ReviewLandlord;
    price: number;
    category: ReviewCategory;
}

export interface ReviewTenantSummary {
    name: string;
    email: string;
}

export interface Review {
    id: string;
    tenantId: string;
    propertyId: string;
    rentalRequestId: string;
    rating: number;
    comment: string;
    status: ReviewStatus;
    createdAt: string;
    updatedAt: string;
    property: ReviewPropertySummary;
    tenant: ReviewTenantSummary;
}

// --- GET /api/reviews/reviews-to-my-properties (landlord: reviews on my properties) ---
export interface ReviewsToMyPropertyPropertySummary {
    title: string;
    description: string;
}

export interface ReviewToMyProperty {
    id: string;
    tenantId: string;
    propertyId: string;
    rentalRequestId: string;
    rating: number;
    comment: string;
    status: ReviewStatus;
    createdAt: string;
    updatedAt: string;
    property: ReviewsToMyPropertyPropertySummary;
    tenant: ReviewTenantSummary;
}

// --- GET /api/reviews/my-reviews (tenant: my own reviews) ---
export interface MyReviewPropertySummary {
    title: string;
    description: string;
    landlord: ReviewLandlord;
}

export interface MyReview {
    id: string;
    tenantId: string;
    propertyId: string;
    rentalRequestId: string;
    rating: number;
    comment: string;
    status: ReviewStatus;
    createdAt: string;
    updatedAt: string;
    property: MyReviewPropertySummary;
}

interface UpdateReviewStatusPayload {
    reviewId: string;
    status: ReviewStatus;
}

interface CreateReviewPayload {
    propertyId: string;
    rating: number;
    comment: string;
}

interface ReviewState {
    // --- Admin: all reviews ---
    reviews: Review[];
    reviewsCount: number;
    isLoadingReviews: boolean;
    reviewsError: string | null;
    fetchAllReviews: () => Promise<void>;
    clearReviews: () => void;

    // --- Landlord: reviews on my properties ---
    reviewsToMyProperties: ReviewToMyProperty[];
    reviewsToMyPropertiesCount: number;
    isLoadingReviewsToMyProperties: boolean;
    reviewsToMyPropertiesError: string | null;
    fetchReviewsToMyProperties: () => Promise<void>;
    clearReviewsToMyProperties: () => void;

    // --- Tenant: my reviews ---
    myReviews: MyReview[];
    myReviewsCount: number;
    isLoadingMyReviews: boolean;
    myReviewsError: string | null;
    fetchMyReviews: () => Promise<void>;
    clearMyReviews: () => void;

    // --- Update review status (admin/landlord) ---
    isUpdatingReviewStatus: boolean;
    updateReviewStatusError: string | null;
    updateReviewStatus: (
        payload: UpdateReviewStatusPayload,
    ) => Promise<boolean>;

    // --- Create review (tenant) ---
    isCreatingReview: boolean;
    createReviewError: string | null;
    createReview: (payload: CreateReviewPayload) => Promise<boolean>;

    // --- Delete review ---
    isDeletingReview: boolean;
    deleteReviewError: string | null;
    deleteReview: (reviewId: string) => Promise<boolean>;
}

export const useReviewStore = create<ReviewState>((set) => ({
    // --- Admin: all reviews ---
    reviews: [],
    reviewsCount: 0,
    isLoadingReviews: false,
    reviewsError: null,

    fetchAllReviews: async () => {
        set({ isLoadingReviews: true, reviewsError: null });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: Review[];
            }>("/reviews");
            set({
                reviews: res.data.data,
                reviewsCount: res.data.count,
                isLoadingReviews: false,
            });
        } catch (err) {
            set({
                reviewsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load reviews.",
                isLoadingReviews: false,
            });
        }
    },

    clearReviews: () =>
        set({
            reviews: [],
            reviewsCount: 0,
            isLoadingReviews: false,
            reviewsError: null,
        }),

    // --- Landlord: reviews on my properties ---
    reviewsToMyProperties: [],
    reviewsToMyPropertiesCount: 0,
    isLoadingReviewsToMyProperties: false,
    reviewsToMyPropertiesError: null,

    fetchReviewsToMyProperties: async () => {
        set({
            isLoadingReviewsToMyProperties: true,
            reviewsToMyPropertiesError: null,
        });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: ReviewToMyProperty[];
            }>("/reviews/reviews-to-my-properties");
            set({
                reviewsToMyProperties: res.data.data,
                reviewsToMyPropertiesCount: res.data.count,
                isLoadingReviewsToMyProperties: false,
            });
        } catch (err) {
            set({
                reviewsToMyPropertiesError:
                    err instanceof Error
                        ? err.message
                        : "Could not load reviews on your properties.",
                isLoadingReviewsToMyProperties: false,
            });
        }
    },

    clearReviewsToMyProperties: () =>
        set({
            reviewsToMyProperties: [],
            reviewsToMyPropertiesCount: 0,
            isLoadingReviewsToMyProperties: false,
            reviewsToMyPropertiesError: null,
        }),

    // --- Tenant: my reviews ---
    myReviews: [],
    myReviewsCount: 0,
    isLoadingMyReviews: false,
    myReviewsError: null,

    fetchMyReviews: async () => {
        set({ isLoadingMyReviews: true, myReviewsError: null });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: MyReview[];
            }>("/reviews/my-reviews");
            set({
                myReviews: res.data.data,
                myReviewsCount: res.data.count,
                isLoadingMyReviews: false,
            });
        } catch (err) {
            set({
                myReviewsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load your reviews.",
                isLoadingMyReviews: false,
            });
        }
    },

    clearMyReviews: () =>
        set({
            myReviews: [],
            myReviewsCount: 0,
            isLoadingMyReviews: false,
            myReviewsError: null,
        }),

    // --- Update review status ---
    isUpdatingReviewStatus: false,
    updateReviewStatusError: null,

    updateReviewStatus: async ({ reviewId, status }) => {
        set({ isUpdatingReviewStatus: true, updateReviewStatusError: null });
        try {
            await api.put<{
                success: boolean;
                statusCode: number;
                message: string;
            }>(`/reviews/status/${reviewId}`, { status });

            // Reflect the change locally across every list that might contain it
            set((state) => ({
                reviews: state.reviews.map((r) =>
                    r.id === reviewId ? { ...r, status } : r,
                ),
                reviewsToMyProperties: state.reviewsToMyProperties.map((r) =>
                    r.id === reviewId ? { ...r, status } : r,
                ),
                myReviews: state.myReviews.map((r) =>
                    r.id === reviewId ? { ...r, status } : r,
                ),
                isUpdatingReviewStatus: false,
            }));

            return true;
        } catch (err) {
            set({
                updateReviewStatusError:
                    err instanceof Error
                        ? err.message
                        : "Could not update review status.",
                isUpdatingReviewStatus: false,
            });
            return false;
        }
    },

    // --- Create review ---
    isCreatingReview: false,
    createReviewError: null,

    createReview: async ({ propertyId, rating, comment }) => {
        set({ isCreatingReview: true, createReviewError: null });
        try {
            await api.post<{
                success: boolean;
                statusCode: number;
                message: string;
                data?: MyReview;
            }>("/reviews", { propertyId, rating, comment });

            set({ isCreatingReview: false });
            return true;
        } catch (err) {
            set({
                createReviewError:
                    err instanceof Error
                        ? err.message
                        : "Could not submit your review.",
                isCreatingReview: false,
            });
            return false;
        }
    },

    // --- Delete review ---
    isDeletingReview: false,
    deleteReviewError: null,

    deleteReview: async (reviewId) => {
        set({ isDeletingReview: true, deleteReviewError: null });
        try {
            await api.delete<{
                success: boolean;
                statusCode: number;
                message: string;
            }>(`/reviews/${reviewId}`);

            // Remove locally from every list that might contain it
            set((state) => ({
                reviews: state.reviews.filter((r) => r.id !== reviewId),
                reviewsCount: state.reviews.some((r) => r.id === reviewId)
                    ? state.reviewsCount - 1
                    : state.reviewsCount,
                reviewsToMyProperties: state.reviewsToMyProperties.filter(
                    (r) => r.id !== reviewId,
                ),
                reviewsToMyPropertiesCount: state.reviewsToMyProperties.some(
                    (r) => r.id === reviewId,
                )
                    ? state.reviewsToMyPropertiesCount - 1
                    : state.reviewsToMyPropertiesCount,
                myReviews: state.myReviews.filter((r) => r.id !== reviewId),
                myReviewsCount: state.myReviews.some((r) => r.id === reviewId)
                    ? state.myReviewsCount - 1
                    : state.myReviewsCount,
                isDeletingReview: false,
            }));

            return true;
        } catch (err) {
            set({
                deleteReviewError:
                    err instanceof Error
                        ? err.message
                        : "Could not delete the review.",
                isDeletingReview: false,
            });
            return false;
        }
    },
}));
