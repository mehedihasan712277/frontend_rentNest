"use client";

import { usePropertyStore } from "@/store/propertyStore";
import { AdminPropertyDetailsSheet } from "./AdminPropertyDetailsSheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function AdminPropertySkeletonRow() {
    return (
        <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
        </div>
    );
}

function statusBadgeClass(status: string) {
    return status === "AVAILABLE"
        ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
        : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400";
}

export function AdminPropertyList() {
    const properties = usePropertyStore((state) => state.adminProperties);
    const isLoading = usePropertyStore(
        (state) => state.isLoadingAdminProperties,
    );
    const error = usePropertyStore((state) => state.adminPropertiesError);

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <AdminPropertySkeletonRow key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <p
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
                {error}
            </p>
        );
    }

    if (properties.length === 0) {
        return (
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                No properties match the current filters.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {properties.map((property) => (
                <div
                    key={property.id}
                    className="flex flex-col gap-4 border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-medium">
                                {property.title}
                            </p>
                            <Badge
                                variant="outline"
                                className={cn(
                                    statusBadgeClass(property.status),
                                )}
                            >
                                {property.status}
                            </Badge>
                            <Badge variant="outline">
                                {property.category.name}
                            </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {property.location} ·{" "}
                            {property.price.toLocaleString()} / month
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <AdminPropertyDetailsSheet property={property} />
                    </div>
                </div>
            ))}
        </div>
    );
}
