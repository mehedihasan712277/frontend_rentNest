"use client";

import { useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { usePropertyStore } from "@/store/propertyStore";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { PropertyFeedbackDialog } from "./PropertyFeedbackDialog";
import { EditPropertyDialog } from "./EditPropertyDialog";
import { PropertyDetailsDialog } from "./PropertyDetailsDialog";

function PropertySkeletonRow() {
    return (
        <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="size-9 rounded-md" />
            </div>
        </div>
    );
}

const GetMyProperties = () => {
    const {
        myProperties,
        isLoadingMyProperties,
        isRefetchingMyProperties,
        myPropertiesError,
        deletingId,
        togglingStatusId,
        fetchMyProperties,
        deleteProperty,
        changePropertyStatus,
    } = usePropertyStore();

    useEffect(() => {
        fetchMyProperties();
    }, [fetchMyProperties]);

    return (
        <div className="space-y-4">
            {/* Mounted once here; it renders whenever the store's `feedback`
                is set by createProperty / updateProperty / deleteProperty /
                changePropertyStatus. */}
            <PropertyFeedbackDialog />

            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">My properties</h2>
                {isRefetchingMyProperties && (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {myPropertiesError && (
                <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                    {myPropertiesError}
                </p>
            )}

            {isLoadingMyProperties ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <PropertySkeletonRow key={i} />
                    ))}
                </div>
            ) : myProperties.length === 0 ? (
                <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    You haven&apos;t listed any properties yet. Add one to get
                    started.
                </p>
            ) : (
                <div className="space-y-3">
                    {myProperties.map((property) => {
                        const isDeleting = deletingId === property.id;
                        const isTogglingStatus =
                            togglingStatusId === property.id;
                        const hasActiveRentals = property.rentals.length > 0;

                        return (
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
                                                property.status === "AVAILABLE"
                                                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                                                    : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
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
                                        {property.price.toLocaleString()} ·{" "}
                                        {property.area.toLocaleString()} sqft
                                    </p>
                                </div>

                                <div className="flex flex-wrap shrink-0 items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {isTogglingStatus && (
                                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                                        )}
                                        <Switch
                                            checked={
                                                property.status === "AVAILABLE"
                                            }
                                            disabled={isTogglingStatus}
                                            onCheckedChange={() =>
                                                changePropertyStatus(
                                                    property.id,
                                                )
                                            }
                                            aria-label={`Toggle availability for ${property.title}`}
                                        />
                                    </div>

                                    <PropertyDetailsDialog
                                        property={property}
                                    />

                                    <EditPropertyDialog property={property} />

                                    <AlertDialog>
                                        <AlertDialogTrigger
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                    size: "icon",
                                                }),
                                            )}
                                            disabled={isDeleting}
                                            aria-label={`Delete ${property.title}`}
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="size-4" />
                                            )}
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete &quot;
                                                    {property.title}&quot;?
                                                </AlertDialogTitle>

                                                <AlertDialogDescription>
                                                    This action cannot be
                                                    undone.
                                                    {hasActiveRentals && (
                                                        <>
                                                            {" "}
                                                            This property is
                                                            currently rented and
                                                            can&apos;t be
                                                            deleted until the
                                                            rental ends.
                                                        </>
                                                    )}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <AlertDialogFooter>
                                                <AlertDialogCancel
                                                    disabled={isDeleting}
                                                >
                                                    Cancel
                                                </AlertDialogCancel>

                                                <AlertDialogAction
                                                    disabled={isDeleting}
                                                    onClick={() =>
                                                        deleteProperty(
                                                            property.id,
                                                        )
                                                    }
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    {isDeleting ? (
                                                        <>
                                                            <Loader2 className="size-4 animate-spin" />
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        "Delete"
                                                    )}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GetMyProperties;
