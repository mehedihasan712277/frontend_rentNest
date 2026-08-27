import { create } from "zustand";

import { api } from "@/lib/axios-client";

export type PropertyStatus = "AVAILABLE" | "NOTAVAILABLE";

/** Amenity as embedded in the public property list response. */
export interface PropertyAmenity {
    id: string;
    name: string;
    description: string;
}

/** Landlord as embedded in the public property list response. */
export interface PropertyListLandlord {
    name: string;
}

/** Category as embedded in the public property list response. */
export interface PropertyListCategory {
    name: string;
}

/** Review as embedded in the public property list response (no `tenant`). */
export interface PropertyReview {
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

/** Shape of a property as returned by the public list endpoint. */
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
    stripeProductId: string;
    stripePriceId: string;
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
    reviews: PropertyReview[];
    landlord: PropertyListLandlord;
    amenities: PropertyAmenity[];
    category: PropertyListCategory;
}

export interface GetAllPropertiesResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: Property[];
}

/** Amenity as embedded in the single-property detail response (no `id`). */
export interface PropertyDetailAmenity {
    name: string;
    description: string;
}

/** Category as embedded in the single-property detail response. */
export interface PropertyDetailCategory {
    name: string;
    description: string;
}

/** Landlord as embedded in the single-property detail response. */
export interface PropertyDetailLandlord {
    name: string;
}

/**
 * Full shape of a single property, from the public single-item endpoint.
 * `reviews` and `hasActiveAccess` are intentionally omitted — not needed here.
 */
export interface PropertyDetail {
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
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
    category: PropertyDetailCategory;
    amenities: PropertyDetailAmenity[];
    landlord: PropertyDetailLandlord;
}

interface GetSinglePropertyResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: PropertyDetail;
}

interface CreatePropertyPayload {
    categoryId: string;
    title: string;
    description: string;
    location: string;
    price: number;
    area: number;
    thumbnail: string;
    amenityIds: string[];
}

// Mirrors the create endpoint's response: no `category`/`amenities`/`landlord`
// relations, just the flat row that was inserted plus the Stripe ids.
interface CreatePropertyResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
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
        status: PropertyStatus;
        createdAt: string;
        updatedAt: string;
    };
}

/** The message returned by a create call, shown in a dialog. */
interface OperationFeedback {
    message: string;
    variant: "success" | "error";
}

/** Amenity as embedded in the my-properties response (no `id`). */
export interface MyPropertyAmenity {
    name: string;
    description: string;
}

/** Tenant as embedded in a my-properties rental request/review/rental. */
export interface MyPropertyTenant {
    name: string;
    email: string;
}

export interface MyPropertyRentalRequest {
    id: string;
    tenantId: string;
    propertyId: string;
    landlordId: string;
    message: string;
    status: string;
    stripeSessionId: string;
    stripeSubscriptionId: string;
    createdAt: string;
    updatedAt: string;
    tenant: MyPropertyTenant;
}

export interface MyPropertyReview {
    id: string;
    tenantId: string;
    propertyId: string;
    rentalRequestId: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    tenant: MyPropertyTenant;
}

export interface MyPropertyRental {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    stripeSubscriptionId: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    tenant: MyPropertyTenant;
}

/** Shape of a property as returned by the landlord's own-properties endpoint. */
export interface MyProperty {
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
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
    amenities: MyPropertyAmenity[];
    rentalRequests: MyPropertyRentalRequest[];
    reviews: MyPropertyReview[];
    rentals: MyPropertyRental[];
    category: PropertyListCategory;
}

interface GetMyPropertiesResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: MyProperty[];
}

interface UpdatePropertyPayload {
    categoryId: string;
    title: string;
    description: string;
    location: string;
    price: number;
    area: number;
    thumbnail: string;
    amenityIds: string[];
}

/** Category as embedded in the update endpoint's response (full row). */
export interface UpdatePropertyCategory {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

/** Amenity as embedded in the update endpoint's response (full row). */
export interface UpdatePropertyAmenity {
    id: string;
    name: string;
    description: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
}

interface UpdatePropertyResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
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
        status: PropertyStatus;
        createdAt: string;
        updatedAt: string;
        category: UpdatePropertyCategory;
        amenities: UpdatePropertyAmenity[];
    };
}

interface ChangePropertyStatusResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        title: string;
        status: PropertyStatus;
    };
}

// No `data` key in the delete response — just success/statusCode/message.
interface DeletePropertyResponse {
    success: boolean;
    statusCode: number;
    message: string;
}

/** Landlord as embedded in the admin properties response (includes email). */
export interface AdminPropertyLandlord {
    name: string;
    email: string;
}

/** Review as embedded in the admin properties response (no `tenant`). */
export interface AdminReview {
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

/** Rental request as embedded in the admin properties response (no `tenant`). */
export interface AdminRentalRequest {
    id: string;
    tenantId: string;
    propertyId: string;
    landlordId: string;
    message: string;
    status: string;
    stripeSessionId: string;
    stripeSubscriptionId: string;
    createdAt: string;
    updatedAt: string;
}

/** Rental as embedded in the admin properties response (no `tenant`). */
export interface AdminRental {
    id: string;
    tenantId: string;
    propertyId: string;
    startDate: string;
    endDate: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    stripeSubscriptionId: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
}

/** Shape of a property as returned by the admin properties endpoint. */
export interface AdminProperty {
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
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
    reviews: AdminReview[];
    landlord: AdminPropertyLandlord;
    amenities: PropertyAmenity[];
    category: PropertyListCategory;
    rentalRequests: AdminRentalRequest[];
    rentals: AdminRental[];
}

interface GetAdminPropertiesResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: AdminProperty[];
}

/**
 * Filters accepted by `GET /api/properties`. `amenities` is sent JSON
 * stringified (e.g. `["id1","id2"]`) since the backend does
 * `JSON.parse(query.amenities as string)`.
 */
export interface PropertyFilters {
    searchTerm: string;
    amenities: string[];
    location: string;
    minPrice: string;
    maxPrice: string;
    categoryId: string;
}

const DEFAULT_FILTERS: PropertyFilters = {
    searchTerm: "",
    amenities: [],
    location: "",
    minPrice: "",
    maxPrice: "",
    categoryId: "",
};

/** Builds a query string from the current filters, omitting empty values. */
function buildPropertyQuery(filters: PropertyFilters): string {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.location) params.set("location", filters.location);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.amenities.length > 0) {
        params.set("amenities", JSON.stringify(filters.amenities));
    }

    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

/**
 * Filters accepted by `GET /api/properties/admin`. Same as `PropertyFilters`
 * plus `status`, since admin can see both AVAILABLE and NOTAVAILABLE
 * properties (the public endpoint always forces AVAILABLE only).
 */
export interface AdminPropertyFilters extends PropertyFilters {
    status: PropertyStatus | "";
}

const DEFAULT_ADMIN_FILTERS: AdminPropertyFilters = {
    ...DEFAULT_FILTERS,
    status: "",
};

/** Builds a query string from the current admin filters, omitting empty values. */
function buildAdminPropertyQuery(filters: AdminPropertyFilters): string {
    const params = new URLSearchParams(buildPropertyQuery(filters).slice(1));
    if (filters.status) params.set("status", filters.status);

    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

/**
 * `true` only for URLs hosted on Unsplash's image CDN. Meant to be called
 * from a thumbnail input's `onChange` for inline validation.
 */
export function isValidThumbnailUrl(url: string): boolean {
    return url.startsWith("https://images.unsplash.com/");
}

interface PropertyState {
    properties: Property[];
    /** true only on the very first load (no data on screen yet) */
    isLoading: boolean;
    /** true on subsequent fetches, e.g. refetching after a filter change */
    isRefetching: boolean;
    /** error from fetchProperties specifically, shown inline */
    fetchError: string | null;
    /** true while a create request is in flight */
    isCreating: boolean;
    /** id of the property currently being updated, if any */
    updatingId: string | null;
    /** id of the property currently being deleted, if any */
    deletingId: string | null;
    /** id of the property whose status is currently being toggled, if any */
    togglingStatusId: string | null;
    /** message from the last create/update/delete/status-change call, shown in a dialog */
    feedback: OperationFeedback | null;

    // Current filter values, bindable directly to a filter UI.
    filters: PropertyFilters;

    // Single-property details, used by a "details" view/dialog.
    selectedProperty: PropertyDetail | null;
    isLoadingDetails: boolean;
    detailsError: string | null;

    // The logged-in landlord's own properties (private, landlord-only).
    myProperties: MyProperty[];
    /** true only on the very first load of myProperties (no data on screen yet) */
    isLoadingMyProperties: boolean;
    /** true on subsequent fetches, e.g. the refetch after a create */
    isRefetchingMyProperties: boolean;
    /** error from fetchMyProperties specifically, shown inline */
    myPropertiesError: string | null;

    // Admin-only view of every property, regardless of status.
    adminProperties: AdminProperty[];
    /** true only on the very first load of adminProperties (no data on screen yet) */
    isLoadingAdminProperties: boolean;
    /** true on subsequent fetches, e.g. refetching after an admin filter change */
    isRefetchingAdminProperties: boolean;
    /** error from fetchAdminProperties specifically, shown inline */
    adminPropertiesError: string | null;
    // Current admin filter values, bindable directly to an admin filter UI.
    adminFilters: AdminPropertyFilters;

    fetchProperties: () => Promise<void>;
    setFilter: <K extends keyof PropertyFilters>(
        key: K,
        value: PropertyFilters[K],
    ) => void;
    resetFilters: () => void;
    createProperty: (payload: CreatePropertyPayload) => Promise<boolean>;
    updateProperty: (
        id: string,
        payload: UpdatePropertyPayload,
    ) => Promise<boolean>;
    deleteProperty: (id: string) => Promise<boolean>;
    changePropertyStatus: (id: string) => Promise<boolean>;
    fetchMyProperties: () => Promise<void>;
    fetchAdminProperties: () => Promise<void>;
    setAdminFilter: <K extends keyof AdminPropertyFilters>(
        key: K,
        value: AdminPropertyFilters[K],
    ) => void;
    resetAdminFilters: () => void;
    fetchPropertyDetails: (id: string) => Promise<void>;
    clearPropertyDetails: () => void;
    clearFeedback: () => void;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
    properties: [],
    isLoading: false,
    isRefetching: false,
    fetchError: null,
    isCreating: false,
    updatingId: null,
    deletingId: null,
    togglingStatusId: null,
    feedback: null,

    filters: DEFAULT_FILTERS,

    selectedProperty: null,
    isLoadingDetails: false,
    detailsError: null,

    myProperties: [],
    isLoadingMyProperties: false,
    isRefetchingMyProperties: false,
    myPropertiesError: null,

    adminProperties: [],
    isLoadingAdminProperties: false,
    isRefetchingAdminProperties: false,
    adminPropertiesError: null,
    adminFilters: DEFAULT_ADMIN_FILTERS,

    fetchProperties: async () => {
        const hasData = get().properties.length > 0;
        set(
            hasData
                ? { isRefetching: true, fetchError: null }
                : { isLoading: true, fetchError: null },
        );

        try {
            const query = buildPropertyQuery(get().filters);
            const res = await api.get<GetAllPropertiesResponse>(
                `/properties${query}`,
            );
            set({ properties: res.data.data });
        } catch (err) {
            set({
                fetchError:
                    err instanceof Error
                        ? err.message
                        : "Could not load properties.",
            });
        } finally {
            set({ isLoading: false, isRefetching: false });
        }
    },

    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value },
        })),

    resetFilters: () => set({ filters: DEFAULT_FILTERS }),

    createProperty: async (payload) => {
        set({ isCreating: true });
        try {
            const res = await api.post<CreatePropertyResponse>(
                "/properties",
                payload,
            );
            // Re-sync with the server: the create response doesn't include
            // the `landlord`/`amenities`/`category` relations, and a full
            // refetch keeps ordering/filtering consistent with the list.
            // Also refresh the landlord's own-properties list so their
            // dashboard reflects the new listing immediately.
            await Promise.all([
                get().fetchProperties(),
                get().fetchMyProperties(),
            ]);
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
                            : "Could not create the property.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ isCreating: false });
        }
    },

    updateProperty: async (id, payload) => {
        set({ updatingId: id });
        try {
            const res = await api.put<UpdatePropertyResponse>(
                `/properties/${id}`,
                payload,
            );
            await Promise.all([
                get().fetchProperties(),
                get().fetchMyProperties(),
            ]);
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
                            : "Could not update the property.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ updatingId: null });
        }
    },

    deleteProperty: async (id) => {
        set({ deletingId: id });
        try {
            const res = await api.delete<DeletePropertyResponse>(
                `/properties/${id}`,
            );
            await Promise.all([
                get().fetchProperties(),
                get().fetchMyProperties(),
            ]);
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
                            : "Could not delete the property.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ deletingId: null });
        }
    },

    changePropertyStatus: async (id) => {
        set({ togglingStatusId: id });
        try {
            const res = await api.put<ChangePropertyStatusResponse>(
                `/properties/change-status/${id}`,
            );
            await Promise.all([
                get().fetchProperties(),
                get().fetchMyProperties(),
            ]);
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
                            : "Could not change the property's status.",
                    variant: "error",
                },
            });
            return false;
        } finally {
            set({ togglingStatusId: null });
        }
    },

    fetchMyProperties: async () => {
        const hasData = get().myProperties.length > 0;
        set(
            hasData
                ? { isRefetchingMyProperties: true, myPropertiesError: null }
                : { isLoadingMyProperties: true, myPropertiesError: null },
        );

        try {
            const res = await api.get<GetMyPropertiesResponse>(
                "/properties/my-properties",
            );
            set({ myProperties: res.data.data });
        } catch (err) {
            set({
                myPropertiesError:
                    err instanceof Error
                        ? err.message
                        : "Could not load your properties.",
            });
        } finally {
            set({
                isLoadingMyProperties: false,
                isRefetchingMyProperties: false,
            });
        }
    },

    fetchAdminProperties: async () => {
        const hasData = get().adminProperties.length > 0;
        set(
            hasData
                ? {
                      isRefetchingAdminProperties: true,
                      adminPropertiesError: null,
                  }
                : {
                      isLoadingAdminProperties: true,
                      adminPropertiesError: null,
                  },
        );

        try {
            const query = buildAdminPropertyQuery(get().adminFilters);
            const res = await api.get<GetAdminPropertiesResponse>(
                `/properties/admin${query}`,
            );
            set({ adminProperties: res.data.data });
        } catch (err) {
            set({
                adminPropertiesError:
                    err instanceof Error
                        ? err.message
                        : "Could not load properties.",
            });
        } finally {
            set({
                isLoadingAdminProperties: false,
                isRefetchingAdminProperties: false,
            });
        }
    },

    setAdminFilter: (key, value) =>
        set((state) => ({
            adminFilters: { ...state.adminFilters, [key]: value },
        })),

    resetAdminFilters: () => set({ adminFilters: DEFAULT_ADMIN_FILTERS }),

    fetchPropertyDetails: async (id) => {
        set({
            isLoadingDetails: true,
            detailsError: null,
            selectedProperty: null,
        });
        try {
            const res = await api.get<GetSinglePropertyResponse>(
                `/properties/${id}`,
            );
            set({ selectedProperty: res.data.data });
        } catch (err) {
            set({
                detailsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load property details.",
            });
        } finally {
            set({ isLoadingDetails: false });
        }
    },

    clearPropertyDetails: () =>
        set({ selectedProperty: null, detailsError: null }),

    clearFeedback: () => set({ feedback: null }),
}));
