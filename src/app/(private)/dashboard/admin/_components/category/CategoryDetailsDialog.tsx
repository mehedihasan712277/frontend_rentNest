"use client";

import { useEffect, useState } from "react";
import { Info, Loader2 } from "lucide-react";

import { useCategoryStore } from "@/store/categoryStore";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface CategoryDetailsDialogProps {
    categoryId: string;
    categoryName: string;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function CategoryDetailsDialog({
    categoryId,
    categoryName,
}: CategoryDetailsDialogProps) {
    const fetchCategoryDetails = useCategoryStore(
        (state) => state.fetchCategoryDetails,
    );
    const clearCategoryDetails = useCategoryStore(
        (state) => state.clearCategoryDetails,
    );
    const selectedCategory = useCategoryStore(
        (state) => state.selectedCategory,
    );
    const isLoadingDetails = useCategoryStore(
        (state) => state.isLoadingDetails,
    );
    const detailsError = useCategoryStore((state) => state.detailsError);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            fetchCategoryDetails(categoryId);
        } else {
            clearCategoryDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, categoryId]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                )}
                aria-label={`View details for ${categoryName}`}
            >
                <Info className="size-4" />
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>
                        {selectedCategory?.name ?? categoryName}
                    </DialogTitle>
                    <DialogDescription>
                        Category details and linked properties.
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
                    ) : selectedCategory ? (
                        <div className="space-y-5 py-2">
                            <p className="text-sm text-muted-foreground">
                                {selectedCategory.description ||
                                    "No description"}
                            </p>

                            <div className="grid grid-cols-3 gap-4 rounded-lg border p-4 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Linked properties
                                    </p>
                                    <p className="font-medium">
                                        {selectedCategory._count.properties}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Created
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(selectedCategory.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Updated
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(selectedCategory.updatedAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Properties (
                                    {selectedCategory.properties.length})
                                </p>
                                {selectedCategory.properties.length === 0 ? (
                                    <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                        No properties linked yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedCategory.properties.map(
                                            (property) => (
                                                <div
                                                    key={property.id}
                                                    className="space-y-3 rounded-md border p-3"
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="font-medium">
                                                                {property.title}
                                                            </p>
                                                            <Badge variant="outline">
                                                                {
                                                                    property.status
                                                                }
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {property.location}
                                                        </p>
                                                        {property.description && (
                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {
                                                                    property.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                                                        <div>
                                                            <p className="text-muted-foreground">
                                                                Price
                                                            </p>
                                                            <p className="font-medium">
                                                                {property.price.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">
                                                                Area
                                                            </p>
                                                            <p className="font-medium">
                                                                {property.area.toLocaleString()}{" "}
                                                                sqft
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">
                                                                Reviews
                                                            </p>
                                                            <p className="font-medium">
                                                                {
                                                                    property
                                                                        ._count
                                                                        .reviews
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">
                                                                Rental requests
                                                            </p>
                                                            <p className="font-medium">
                                                                {
                                                                    property
                                                                        ._count
                                                                        .rentalRequests
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-md bg-muted/50 p-2 text-xs">
                                                        <p className="text-muted-foreground">
                                                            Landlord
                                                        </p>
                                                        <p className="font-medium">
                                                            {
                                                                property
                                                                    .landlord
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            {
                                                                property
                                                                    .landlord
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>

                                                    {property.amenities.length >
                                                        0 && (
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-muted-foreground">
                                                                Amenities
                                                            </p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {property.amenities.map(
                                                                    (
                                                                        amenity,
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                amenity.id
                                                                            }
                                                                            variant="secondary"
                                                                        >
                                                                            {
                                                                                amenity.name
                                                                            }
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
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
