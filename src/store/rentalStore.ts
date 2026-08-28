import { create } from "zustand";
import { api } from "@/lib/axios-client";

export type RentalStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "PAST_DUE";

export interface RentalLandlord {
    name: string;
    email: string;
}

export interface RentalPropertySummary {
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    area: number;
    landlord: RentalLandlord;
}

export interface RentalTenantProfile {
    id: string;
    profilePhoto: string | null;
    bio: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface RentalTenantSummary {
    name: string;
    email: string;
    profile: RentalTenantProfile;
}

export interface RentalInfo {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string | null;
    status: RentalStatus;
    createdAt: string;
    updatedAt: string;
    stripeSubscriptionId: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    property: RentalPropertySummary;
    tenant: RentalTenantSummary;
}

// --- /rentals/my-property-rentals ---
// Rentals made by tenants on properties the current (landlord) user owns.
export interface MyPropertyRentalTenant {
    name: string;
    email: string;
}

export interface MyPropertyRentalPropertySummary {
    title: string;
}

export interface MyPropertyRental {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string | null;
    status: RentalStatus;
    createdAt: string;
    updatedAt: string;
    stripeSubscriptionId: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    tenant: MyPropertyRentalTenant;
    property: MyPropertyRentalPropertySummary;
}

// --- /rentals/my-rentals ---
// Rentals the current (tenant) user holds.
export interface MyRentalPropertySummary {
    title: string;
    location: string;
    thumbnail: string;
    price: number;
}

export interface MyRental {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string | null;
    status: RentalStatus;
    createdAt: string;
    updatedAt: string;
    stripeSubscriptionId: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    property: MyRentalPropertySummary;
}

interface RentalState {
    // --- Admin: all rentals ---
    rentals: RentalInfo[];
    isLoadingRentals: boolean;
    rentalsError: string | null;
    fetchAllRentals: () => Promise<void>;
    clearRentals: () => void;

    // --- Landlord: rentals on my properties ---
    myPropertyRentals: MyPropertyRental[];
    myPropertyRentalsCount: number;
    isLoadingMyPropertyRentals: boolean;
    myPropertyRentalsError: string | null;
    fetchMyPropertyRentals: () => Promise<void>;
    clearMyPropertyRentals: () => void;

    // --- Tenant: my rentals ---
    myRentals: MyRental[];
    myRentalsCount: number;
    isLoadingMyRentals: boolean;
    myRentalsError: string | null;
    fetchMyRentals: () => Promise<void>;
    clearMyRentals: () => void;
}

export const useRentalStore = create<RentalState>((set) => ({
    // --- Admin: all rentals ---
    rentals: [],
    isLoadingRentals: false,
    rentalsError: null,

    fetchAllRentals: async () => {
        set({ isLoadingRentals: true, rentalsError: null });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                message: string;
                data: RentalInfo[];
            }>("/rentals/all-rental-info");
            set({
                rentals: res.data.data,
                isLoadingRentals: false,
            });
        } catch (err) {
            set({
                rentalsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load rental data.",
                isLoadingRentals: false,
            });
        }
    },

    clearRentals: () =>
        set({ rentals: [], isLoadingRentals: false, rentalsError: null }),

    // --- Landlord: rentals on my properties ---
    myPropertyRentals: [],
    myPropertyRentalsCount: 0,
    isLoadingMyPropertyRentals: false,
    myPropertyRentalsError: null,

    fetchMyPropertyRentals: async () => {
        set({
            isLoadingMyPropertyRentals: true,
            myPropertyRentalsError: null,
        });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: MyPropertyRental[];
            }>("/rentals/my-property-rentals");
            set({
                myPropertyRentals: res.data.data,
                myPropertyRentalsCount: res.data.count,
                isLoadingMyPropertyRentals: false,
            });
        } catch (err) {
            set({
                myPropertyRentalsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load rentals on your properties.",
                isLoadingMyPropertyRentals: false,
            });
        }
    },

    clearMyPropertyRentals: () =>
        set({
            myPropertyRentals: [],
            myPropertyRentalsCount: 0,
            isLoadingMyPropertyRentals: false,
            myPropertyRentalsError: null,
        }),

    // --- Tenant: my rentals ---
    myRentals: [],
    myRentalsCount: 0,
    isLoadingMyRentals: false,
    myRentalsError: null,

    fetchMyRentals: async () => {
        set({ isLoadingMyRentals: true, myRentalsError: null });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: MyRental[];
            }>("/rentals/my-rentals");
            set({
                myRentals: res.data.data,
                myRentalsCount: res.data.count,
                isLoadingMyRentals: false,
            });
        } catch (err) {
            set({
                myRentalsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load your rentals.",
                isLoadingMyRentals: false,
            });
        }
    },

    clearMyRentals: () =>
        set({
            myRentals: [],
            myRentalsCount: 0,
            isLoadingMyRentals: false,
            myRentalsError: null,
        }),
}));
