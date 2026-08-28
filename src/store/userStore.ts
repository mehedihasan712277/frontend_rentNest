import { create } from "zustand";
import { api } from "@/lib/axios-client";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface ProfileDetails {
    id: string;
    profilePhoto: string | null;
    bio: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Property {
    id: string;
    landlordId: string;
    categoryId: string;
    title: string;
    description: string;
    location: string;
    price: number;
    area: number;
    thumbnail: string;
    stripeProductId?: string;
    stripePriceId?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Amenity {
    id?: string;
    name: string;
    description?: string;
    creatorId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RentalRequest {
    id: string;
    tenantId: string;
    propertyId: string;
    landlordId: string;
    message: string;
    status: string;
    stripeSessionId?: string;
    stripeSubscriptionId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    tenantId: string;
    propertyId: string;
    rentalRequestId: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Rental {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string | null;
    status: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    createdAt: string;
    updatedAt: string;
}

// New: payments only appear on the admin "all users" endpoint
export interface Payment {
    id: string;
    rentalId: string;
    userId: string;
    transactionId: string;
    stripeInvoiceId: string;
    amount: number;
    status: string;
    paidAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    stripeCustomerId: string | null;
    profile: ProfileDetails;
    // Only meaningful for LANDLORD; always [] for ADMIN/TENANT.
    properties: Property[];
    // Meaningful for ADMIN/LANDLORD; always [] for TENANT.
    amenity: Amenity[];
    // Only meaningful for TENANT; always [] for ADMIN/LANDLORD.
    rentalRequests: RentalRequest[];
    reviews: Review[];
    rentals?: Rental[];
    // Only present on the admin "all users" listing
    payments?: Payment[];
}

interface UpdateUserStatusPayload {
    id: string;
    status: UserStatus;
}

interface UserProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    clearProfile: () => void;

    // --- Admin: all users ---
    allUsers: UserProfile[];
    allUsersCount: number;
    isLoadingAllUsers: boolean;
    allUsersError: string | null;
    fetchAllUsers: () => Promise<void>;
    clearAllUsers: () => void;

    // --- Admin: update user status ("delete-account" route) ---
    isUpdatingUserStatus: boolean;
    updateUserStatusError: string | null;
    updateUserStatus: (payload: UpdateUserStatusPayload) => Promise<boolean>;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<{
                success: boolean;
                message: string;
                data: UserProfile;
            }>("/users/my-profile");
            set({ profile: res.data.data, isLoading: false });
        } catch (err) {
            set({
                error:
                    err instanceof Error
                        ? err.message
                        : "Could not load your profile.",
                isLoading: false,
            });
        }
    },

    clearProfile: () => set({ profile: null, isLoading: false, error: null }),

    // --- Admin: all users ---
    allUsers: [],
    allUsersCount: 0,
    isLoadingAllUsers: false,
    allUsersError: null,

    fetchAllUsers: async () => {
        set({ isLoadingAllUsers: true, allUsersError: null });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: UserProfile[];
            }>("/users/all");
            set({
                allUsers: res.data.data,
                allUsersCount: res.data.count,
                isLoadingAllUsers: false,
            });
        } catch (err) {
            set({
                allUsersError:
                    err instanceof Error
                        ? err.message
                        : "Could not load users.",
                isLoadingAllUsers: false,
            });
        }
    },

    clearAllUsers: () =>
        set({
            allUsers: [],
            allUsersCount: 0,
            isLoadingAllUsers: false,
            allUsersError: null,
        }),

    // --- Admin: update user status ("delete-account" route) ---
    isUpdatingUserStatus: false,
    updateUserStatusError: null,

    updateUserStatus: async ({ id, status }) => {
        set({ isUpdatingUserStatus: true, updateUserStatusError: null });
        try {
            await api.put<{
                success: boolean;
                statusCode: number;
                message: string;
                data?: UserProfile;
            }>("/users/delete-account", { id, status });

            // Reflect the change locally: update the matching entry in allUsers,
            // and the current profile if it's the same user.
            set((state) => ({
                allUsers: state.allUsers.map((u) =>
                    u.id === id ? { ...u, status } : u,
                ),
                profile:
                    state.profile && state.profile.id === id
                        ? { ...state.profile, status }
                        : state.profile,
                isUpdatingUserStatus: false,
            }));

            return true;
        } catch (err) {
            set({
                updateUserStatusError:
                    err instanceof Error
                        ? err.message
                        : "Could not update user status.",
                isUpdatingUserStatus: false,
            });
            return false;
        }
    },
}));
