"use client";

import { useEffect, useMemo, useState } from "react";

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
    MyPropertyRental,
    RentalStatus,
    useRentalStore,
} from "@/store/rentalStore";

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

const MyRentedProperty = () => {
    const {
        myPropertyRentals,
        myPropertyRentalsCount,
        isLoadingMyPropertyRentals,
        myPropertyRentalsError,
        fetchMyPropertyRentals,
    } = useRentalStore();

    const [statusFilter, setStatusFilter] = useState<RentalStatus | "ALL">(
        "ALL",
    );

    useEffect(() => {
        fetchMyPropertyRentals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredRentals: MyPropertyRental[] = useMemo(() => {
        if (statusFilter === "ALL") return myPropertyRentals;
        return myPropertyRentals.filter(
            (rental) => rental.status === statusFilter,
        );
    }, [myPropertyRentals, statusFilter]);

    const handleRefresh = () => {
        fetchMyPropertyRentals();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Rentals on My Properties
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {filteredRentals.length} of {myPropertyRentalsCount}{" "}
                        rental{myPropertyRentalsCount === 1 ? "" : "s"} shown
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
                        disabled={isLoadingMyPropertyRentals}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${
                                isLoadingMyPropertyRentals ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {myPropertyRentalsError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {myPropertyRentalsError}
                </div>
            )}

            <div className="rounded-md border">
                {/* Header row — only visible on md+ where columns line up */}
                <div className="hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2fr_2fr_1fr_2fr_1fr]">
                    <span>Property</span>
                    <span>Tenant</span>
                    <span>Status</span>
                    <span>Period</span>
                    <span className="text-right">Auto-renew</span>
                </div>

                <div className="divide-y">
                    {isLoadingMyPropertyRentals &&
                    myPropertyRentals.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-4 py-3">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))
                    ) : filteredRentals.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            {myPropertyRentals.length === 0
                                ? "No one has rented your properties yet."
                                : "No rentals match this status."}
                        </div>
                    ) : (
                        filteredRentals.map((rental) => (
                            <div
                                key={rental.id}
                                className="flex flex-col gap-3 px-4 py-3 md:grid md:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:items-center md:gap-2"
                            >
                                {/* Property */}
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {rental.property.title}
                                    </span>
                                </div>

                                {/* Tenant */}
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Tenant
                                    </span>
                                    <span className="truncate text-sm font-medium">
                                        {rental.tenant.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {rental.tenant.email}
                                    </span>
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
                                </div>

                                {/* Auto-renew */}
                                <div className="flex items-center justify-between text-sm md:block md:text-right">
                                    <span className="text-muted-foreground md:hidden">
                                        Auto-renew
                                    </span>
                                    <span
                                        className={
                                            rental.cancelAtPeriodEnd
                                                ? "text-destructive"
                                                : "text-muted-foreground"
                                        }
                                    >
                                        {rental.cancelAtPeriodEnd
                                            ? "Cancels at end"
                                            : "Renews"}
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

export default MyRentedProperty;
