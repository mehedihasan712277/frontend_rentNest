import { create } from "zustand";
import { api } from "@/lib/axios-client";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

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
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Amenity {
    id: string;
    name: string;
    description: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface RentalRequest {
    id: string;
    tenantId: string;
    propertyId: string;
    landlordId: string;
    message: string;
    status: string;
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
    rentals: Rental[];
}

interface UserProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
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
}));
