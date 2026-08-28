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
import { MyRental, RentalStatus, useRentalStore } from "@/store/rentalStore";

const STATUS_FILTER_OPTIONS: Array<RentalStatus | "ALL"> = [
    "ALL",
    "ACTIVE",
    "CANCELED",
    "EXPIRED",
    "PAST_DUE",
];

const statusBadgeVariant = (status: RentalStatus) => {
    switch (status) {
        case "ACTIVE":
            return "default";
        case "CANCELED":
            return "destructive";
        case "EXPIRED":
            return "secondary";
        case "PAST_DUE":
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

const MyRentals = () => {
    const {
        myRentals,
        myRentalsCount,
        isLoadingMyRentals,
        myRentalsError,
        fetchMyRentals,
    } = useRentalStore();

    const [statusFilter, setStatusFilter] = useState<RentalStatus | "ALL">(
        "ALL",
    );

    useEffect(() => {
        fetchMyRentals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredRentals: MyRental[] = useMemo(() => {
        if (statusFilter === "ALL") return myRentals;
        return myRentals.filter((rental) => rental.status === statusFilter);
    }, [myRentals, statusFilter]);

    const handleRefresh = () => {
        fetchMyRentals();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">My Rentals</h2>
                    <p className="text-sm text-muted-foreground">
                        {filteredRentals.length} of {myRentalsCount} rental
                        {myRentalsCount === 1 ? "" : "s"} shown
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                            setStatusFilter(value as RentalStatus | "ALL")
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
                        disabled={isLoadingMyRentals}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${
                                isLoadingMyRentals ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {myRentalsError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {myRentalsError}
                </div>
            )}

            <div className="rounded-md border">
                {/* Header row — only visible on md+ where columns line up */}
                <div className="hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2.5fr_1fr_2fr_1fr]">
                    <span>Property</span>
                    <span>Status</span>
                    <span>Period</span>
                    <span className="text-right">Price</span>
                </div>

                <div className="divide-y">
                    {isLoadingMyRentals && myRentals.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-4 py-3">
                                <Skeleton className="h-14 w-full" />
                            </div>
                        ))
                    ) : filteredRentals.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            {myRentals.length === 0
                                ? "You don't have any rentals yet."
                                : "No rentals match this status."}
                        </div>
                    ) : (
                        filteredRentals.map((rental) => (
                            <div
                                key={rental.id}
                                className="flex flex-col gap-3 px-4 py-3 md:grid md:grid-cols-[2.5fr_1fr_2fr_1fr] md:items-center md:gap-2"
                            >
                                {/* Property */}
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                        {rental.property.thumbnail ? (
                                            <Image
                                                src={rental.property.thumbnail}
                                                alt={rental.property.title}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="flex min-w-0 flex-col">
                                        <span className="truncate font-medium">
                                            {rental.property.title}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {rental.property.location}
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
                                            rental.status,
                                        )}
                                    >
                                        {rental.status}
                                    </Badge>
                                </div>

                                {/* Period */}
                                <div className="flex flex-col text-sm">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Period
                                    </span>
                                    <span>
                                        {formatDate(rental.currentPeriodStart)}
                                        {" – "}
                                        {formatDate(rental.currentPeriodEnd)}
                                    </span>
                                    {rental.cancelAtPeriodEnd && (
                                        <span className="text-xs text-destructive">
                                            Cancels at period end
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between text-sm md:block md:text-right">
                                    <span className="text-muted-foreground md:hidden">
                                        Price
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(rental.property.price)}
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

export default MyRentals;
