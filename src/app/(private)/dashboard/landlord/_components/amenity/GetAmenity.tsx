"use client";

import { useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { useAmenityStore } from "@/store/amenityStore";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { AmenityFeedbackDialog } from "./AmenityFeedbackDialof";
import { AmenityMetaDetails } from "./AmenityMetaDetails";

function AmenitySkeletonRow() {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="size-9 rounded-md" />
        </div>
    );
}

export default function GetAmenity() {
    const {
        amenities,
        isLoading,
        isRefetching,
        fetchError,
        deletingId,
        fetchAmenities,
        deleteAmenity,
    } = useAmenityStore();

    useEffect(() => {
        fetchAmenities();
    }, [fetchAmenities]);

    return (
        <div className="space-y-4">
            {/* Mounted once here; it renders whenever the store's `feedback`
                is set by createAmenity / deleteAmenity. */}
            <AmenityFeedbackDialog />

            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Amenities</h2>
                {isRefetching && (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {fetchError && (
                <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                    {fetchError}
                </p>
            )}

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <AmenitySkeletonRow key={i} />
                    ))}
                </div>
            ) : amenities.length === 0 ? (
                <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No amenities yet. Create one above to get started.
                </p>
            ) : (
                <div className="space-y-3">
                    {amenities.map((amenity) => {
                        const isDeleting = deletingId === amenity.id;

                        return (
                            <div
                                key={amenity.id}
                                className="flex items-center justify-between gap-4 rounded-lg border p-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {amenity.name}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {amenity.description ||
                                            "No description"}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {amenity?._count?.properties}{" "}
                                        {amenity?._count?.properties === 1 ||
                                        amenity?._count?.properties === 0
                                            ? "property"
                                            : "properties"}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <AmenityMetaDetails amenity={amenity} />

                                    <AlertDialog>
                                        <AlertDialogTrigger
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                    size: "icon",
                                                }),
                                            )}
                                            disabled={isDeleting}
                                            aria-label={`Delete ${amenity.name}`}
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
                                                    {amenity.name}&quot;?
                                                </AlertDialogTitle>

                                                <AlertDialogDescription>
                                                    This action cannot be
                                                    undone.
                                                    {amenity?._count
                                                        .properties > 0 && (
                                                        <>
                                                            {" "}
                                                            This amenity has{" "}
                                                            {
                                                                amenity._count
                                                                    .properties
                                                            }{" "}
                                                            linked{" "}
                                                            {amenity?._count
                                                                .properties ===
                                                            1
                                                                ? "property"
                                                                : "properties"}
                                                            .
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
                                                        deleteAmenity(
                                                            amenity.id,
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
}
