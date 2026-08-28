"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import {
    MyPayment as MyPaymentType,
    PaymentStatus,
    usePaymentStore,
} from "@/store/paymentStore";

const STATUS_FILTER_OPTIONS: Array<PaymentStatus | "ALL"> = [
    "ALL",
    "PENDING",
    "COMPLETED",
    "FAILED",
    "REFUNDED",
];

const statusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
        case "COMPLETED":
            return "default";
        case "PENDING":
            return "secondary";
        case "FAILED":
            return "destructive";
        case "REFUNDED":
            return "outline";
        default:
            return "outline";
    }
};

const formatDate = (value: string | null) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(value);

const MyPayment = () => {
    const {
        myPayments,
        myPaymentsCount,
        isLoadingMyPayments,
        myPaymentsError,
        fetchMyPayments,
    } = usePaymentStore();

    const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">(
        "ALL",
    );

    useEffect(() => {
        fetchMyPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredPayments: MyPaymentType[] = useMemo(() => {
        if (statusFilter === "ALL") return myPayments;
        return myPayments.filter((payment) => payment.status === statusFilter);
    }, [myPayments, statusFilter]);

    const handleRefresh = () => {
        fetchMyPayments();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">My Payments</h2>
                    <p className="text-sm text-muted-foreground">
                        {filteredPayments.length} of {myPaymentsCount} payment
                        {myPaymentsCount === 1 ? "" : "s"} shown
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                            setStatusFilter(value as PaymentStatus | "ALL")
                        }
                    >
                        <SelectTrigger className="h-9 w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_FILTER_OPTIONS.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status === "ALL" ? "All statuses" : status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoadingMyPayments}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${
                                isLoadingMyPayments ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {myPaymentsError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {myPaymentsError}
                </div>
            )}

            <div className="rounded-md border">
                {/* Header row — only visible on md+ where columns line up */}
                <div className="hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2.5fr_1fr_1fr_1fr]">
                    <span>Property</span>
                    <span>Status</span>
                    <span>Paid At</span>
                    <span className="text-right">Amount</span>
                </div>

                <div className="divide-y">
                    {isLoadingMyPayments && myPayments.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-4 py-3">
                                <Skeleton className="h-14 w-full" />
                            </div>
                        ))
                    ) : filteredPayments.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            {myPayments.length === 0
                                ? "You don't have any payments yet."
                                : "No payments match this status."}
                        </div>
                    ) : (
                        filteredPayments.map((payment) => (
                            <div
                                key={payment.id}
                                className="flex flex-col gap-3 px-4 py-3 md:grid md:grid-cols-[2.5fr_1fr_1fr_1fr] md:items-center md:gap-2"
                            >
                                {/* Property */}
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                        {payment.rental.property.thumbnail ? (
                                            <Image
                                                src={
                                                    payment.rental.property
                                                        .thumbnail
                                                }
                                                alt={
                                                    payment.rental.property
                                                        .title
                                                }
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="flex min-w-0 flex-col">
                                        <span className="truncate font-medium">
                                            {payment.rental.property.title}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {payment.rental.property.location}
                                        </span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Status:
                                    </span>
                                    <Badge
                                        variant={statusBadgeVariant(
                                            payment.status,
                                        )}
                                    >
                                        {payment.status}
                                    </Badge>
                                </div>

                                {/* Paid At */}
                                <div className="flex items-center justify-between text-sm md:block">
                                    <span className="text-muted-foreground md:hidden">
                                        Paid At
                                    </span>
                                    <span>{formatDate(payment.paidAt)}</span>
                                </div>

                                {/* Amount */}
                                <div className="flex items-center justify-between text-sm md:block md:text-right">
                                    <span className="text-muted-foreground md:hidden">
                                        Amount
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(payment.amount)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPayment;
