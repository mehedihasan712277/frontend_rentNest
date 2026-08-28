import { create } from "zustand";
import { api } from "@/lib/axios-client";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

// --- GET /api/payments (admin: all payments) ---
export interface PaymentLandlord {
    id: string;
    name: string;
}

export interface PaymentPropertySummary {
    id: string;
    title: string;
    landlord: PaymentLandlord;
}

export interface PaymentRentalSummary {
    id: string;
    status: string;
    property: PaymentPropertySummary;
}

export interface PaymentUserSummary {
    id: string;
    name: string;
    email: string;
}

export interface Payment {
    id: string;
    rentalId: string;
    userId: string;
    transactionId: string;
    stripeInvoiceId: string;
    amount: number;
    status: PaymentStatus;
    paidAt: string;
    createdAt: string;
    updatedAt: string;
    user: PaymentUserSummary;
    rental: PaymentRentalSummary;
}

// --- GET /api/payments/my-payments (tenant: my own payments) ---
export interface MyPaymentPropertySummary {
    id: string;
    title: string;
    location: string;
    thumbnail: string;
    price: number;
}

export interface MyPaymentRentalSummary {
    id: string;
    status: string;
    property: MyPaymentPropertySummary;
}

export interface MyPayment {
    id: string;
    rentalId: string;
    userId: string;
    transactionId: string;
    stripeInvoiceId: string;
    amount: number;
    status: PaymentStatus;
    paidAt: string;
    createdAt: string;
    updatedAt: string;
    rental: MyPaymentRentalSummary;
}

// --- GET /api/payments/my-property-payments (landlord: payments on my properties) ---
export interface MyPropertyPaymentPropertySummary {
    id: string;
    title: string;
}

export interface MyPropertyPaymentRentalSummary {
    id: string;
    status: string;
    property: MyPropertyPaymentPropertySummary;
}

export interface MyPropertyPayment {
    id: string;
    rentalId: string;
    userId: string;
    transactionId: string;
    stripeInvoiceId: string;
    amount: number;
    status: PaymentStatus;
    paidAt: string;
    createdAt: string;
    updatedAt: string;
    user: PaymentUserSummary;
    rental: MyPropertyPaymentRentalSummary;
}

interface PaymentState {
    // --- Admin: all payments ---
    payments: Payment[];
    paymentsCount: number;
    isLoadingPayments: boolean;
    paymentsError: string | null;
    fetchAllPayments: () => Promise<void>;
    clearPayments: () => void;

    // --- Tenant: my payments ---
    myPayments: MyPayment[];
    myPaymentsCount: number;
    isLoadingMyPayments: boolean;
    myPaymentsError: string | null;
    fetchMyPayments: () => Promise<void>;
    clearMyPayments: () => void;

    // --- Landlord: payments on my properties ---
    myPropertyPayments: MyPropertyPayment[];
    myPropertyPaymentsCount: number;
    isLoadingMyPropertyPayments: boolean;
    myPropertyPaymentsError: string | null;
    fetchMyPropertyPayments: () => Promise<void>;
    clearMyPropertyPayments: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
    // --- Admin: all payments ---
    payments: [],
    paymentsCount: 0,
    isLoadingPayments: false,
    paymentsError: null,

    fetchAllPayments: async () => {
        set({ isLoadingPayments: true, paymentsError: null });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: Payment[];
            }>("/payments");
            set({
                payments: res.data.data,
                paymentsCount: res.data.count,
                isLoadingPayments: false,
            });
        } catch (err) {
            set({
                paymentsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load payments.",
                isLoadingPayments: false,
            });
        }
    },

    clearPayments: () =>
        set({
            payments: [],
            paymentsCount: 0,
            isLoadingPayments: false,
            paymentsError: null,
        }),

    // --- Tenant: my payments ---
    myPayments: [],
    myPaymentsCount: 0,
    isLoadingMyPayments: false,
    myPaymentsError: null,

    fetchMyPayments: async () => {
        set({ isLoadingMyPayments: true, myPaymentsError: null });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: MyPayment[];
            }>("/payments/my-payments");
            set({
                myPayments: res.data.data,
                myPaymentsCount: res.data.count,
                isLoadingMyPayments: false,
            });
        } catch (err) {
            set({
                myPaymentsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load your payments.",
                isLoadingMyPayments: false,
            });
        }
    },

    clearMyPayments: () =>
        set({
            myPayments: [],
            myPaymentsCount: 0,
            isLoadingMyPayments: false,
            myPaymentsError: null,
        }),

    // --- Landlord: payments on my properties ---
    myPropertyPayments: [],
    myPropertyPaymentsCount: 0,
    isLoadingMyPropertyPayments: false,
    myPropertyPaymentsError: null,

    fetchMyPropertyPayments: async () => {
        set({
            isLoadingMyPropertyPayments: true,
            myPropertyPaymentsError: null,
        });
        try {
            const res = await api.get<{
                success: boolean;
                statusCode: number;
                count: number;
                message: string;
                data: MyPropertyPayment[];
            }>("/payments/my-property-payments");
            set({
                myPropertyPayments: res.data.data,
                myPropertyPaymentsCount: res.data.count,
                isLoadingMyPropertyPayments: false,
            });
        } catch (err) {
            set({
                myPropertyPaymentsError:
                    err instanceof Error
                        ? err.message
                        : "Could not load payments on your properties.",
                isLoadingMyPropertyPayments: false,
            });
        }
    },

    clearMyPropertyPayments: () =>
        set({
            myPropertyPayments: [],
            myPropertyPaymentsCount: 0,
            isLoadingMyPropertyPayments: false,
            myPropertyPaymentsError: null,
        }),
}));
