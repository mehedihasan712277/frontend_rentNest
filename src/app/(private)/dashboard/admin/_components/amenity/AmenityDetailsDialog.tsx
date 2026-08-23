"use client";

import { useEffect, useState } from "react";
import { Info, Loader2 } from "lucide-react";

import { useAmenityStore } from "@/store/amenityStore";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AmenityDetailsDialogProps {
    amenityId: string;
    amenityName: string;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function AmenityDetailsDialog({
    amenityId,
    amenityName,
}: AmenityDetailsDialogProps) {
    const fetchAmenityDetails = useAmenityStore(
        (state) => state.fetchAmenityDetails,
    );
    const clearAmenityDetails = useAmenityStore(
        (state) => state.clearAmenityDetails,
    );
    const selectedAmenity = useAmenityStore((state) => state.selectedAmenity);
    const isLoadingDetails = useAmenityStore((state) => state.isLoadingDetails);
    const detailsError = useAmenityStore((state) => state.detailsError);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            fetchAmenityDetails(amenityId);
        } else {
            clearAmenityDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, amenityId]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                )}
                aria-label={`View details for ${amenityName}`}
            >
                <Info className="size-4" />
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>
                        {selectedAmenity?.name ?? amenityName}
                    </DialogTitle>
                    <DialogDescription>
                        Amenity details and linked properties.
                    </DialogDescription>
                </DialogHeader>

                <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
                    {isLoadingDetails ? (
                        <div className="space-y-4 py-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="space-y-2 pt-2">
                                <Skeleton className="h-12 w-full rounded-md" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                        </div>
                    ) : detailsError ? (
                        <p
                            role="alert"
                            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        >
                            {detailsError}
                        </p>
                    ) : selectedAmenity ? (
                        <div className="space-y-5 py-2">
                            <p className="text-sm text-muted-foreground">
                                {selectedAmenity.description ||
                                    "No description"}
                            </p>

                            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm sm:grid-cols-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Linked properties
                                    </p>
                                    <p className="font-medium">
                                        {selectedAmenity._count.properties}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Created
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(selectedAmenity.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Updated
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(selectedAmenity.updatedAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border p-4 text-sm">
                                <p className="text-xs text-muted-foreground">
                                    Created by
                                </p>
                                <p className="font-medium">
                                    {selectedAmenity.creator.name}
                                </p>
                                <p className="text-muted-foreground">
                                    {selectedAmenity.creator.email}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Properties (
                                    {selectedAmenity.properties.length})
                                </p>
                                {selectedAmenity.properties.length === 0 ? (
                                    <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                        No properties linked yet.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedAmenity.properties.map(
                                            (property) => (
                                                <div
                                                    key={property.id}
                                                    className="rounded-md border p-3"
                                                >
                                                    <p className="truncate font-medium">
                                                        {property.title}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {property.location}
                                                    </p>
                                                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>
                                                            {property.price.toLocaleString()}
                                                        </span>
                                                        <span>
                                                            {property.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>

                <DialogFooter>
                    <DialogClose
                        className={cn(buttonVariants({ variant: "outline" }))}
                        disabled={isLoadingDetails}
                    >
                        {isLoadingDetails ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            "Close"
                        )}
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
