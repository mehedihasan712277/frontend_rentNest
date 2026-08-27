"use client";

import { useState } from "react";
import { Info } from "lucide-react";

import { type MyProperty } from "@/store/propertyStore";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface PropertyDetailsDialogProps {
    property: MyProperty;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Shows the meaningful fields on a `MyProperty` that aren't already visible
 * in the `GetMyProperties` row (title, status, location, price, area). IDs
 * (property/landlord/category/Stripe) are intentionally left out — they're
 * not useful to a landlord reading this. This is purely a display of data
 * already held in the store from `GET /properties/my-properties` — no fetch
 * happens here.
 */
export function PropertyDetailsDialog({
    property,
}: PropertyDetailsDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                )}
                aria-label={`View details for ${property.title}`}
            >
                <Info className="size-4" />
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>{property.title}</DialogTitle>
                    <DialogDescription>
                        Full details for this property.
                    </DialogDescription>
                </DialogHeader>

                <div className="-mx-4 no-scrollbar max-h-[65vh] space-y-5 overflow-y-auto px-4 py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={property.thumbnail}
                        alt={property.title}
                        className="h-40 w-full rounded-md object-cover"
                    />

                    <p className="text-sm text-muted-foreground">
                        {property.description || "No description"}
                    </p>

                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Category
                            </p>
                            <p className="font-medium">
                                {property.category.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Status
                            </p>
                            <Badge variant="outline">{property.status}</Badge>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Location
                            </p>
                            <p className="font-medium">{property.location}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Area
                            </p>
                            <p className="font-medium">
                                {property.area.toLocaleString()} sqft
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Price
                            </p>
                            <p className="font-medium">
                                {property.price.toLocaleString()} / month
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Listed on
                            </p>
                            <p className="font-medium">
                                {formatDate(property.createdAt)}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">
                                Last updated
                            </p>
                            <p className="font-medium">
                                {formatDate(property.updatedAt)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Amenities ({property.amenities.length})
                        </p>
                        {property.amenities.length === 0 ? (
                            <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                No amenities linked.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {property.amenities.map((amenity) => (
                                    <div
                                        key={amenity.name}
                                        className="rounded-md bg-muted/50 p-2 text-xs"
                                    >
                                        <p className="font-medium">
                                            {amenity.name}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {amenity.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Rental requests ({property.rentalRequests.length})
                        </p>
                        {property.rentalRequests.length === 0 ? (
                            <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                No rental requests yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {property.rentalRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="space-y-1 rounded-md border p-3 text-xs"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium">
                                                {request.tenant.name}
                                            </p>
                                            <Badge variant="secondary">
                                                {request.status}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {request.tenant.email}
                                        </p>
                                        <p>{request.message}</p>
                                        <p className="text-muted-foreground">
                                            {formatDate(request.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Reviews ({property.reviews.length})
                        </p>
                        {property.reviews.length === 0 ? (
                            <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                No reviews yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {property.reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="space-y-1 rounded-md border p-3 text-xs"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium">
                                                {review.tenant.name} ·{" "}
                                                {review.rating.toFixed(1)} / 5
                                            </p>
                                            <Badge variant="secondary">
                                                {review.status}
                                            </Badge>
                                        </div>
                                        <p>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Rentals ({property.rentals.length})
                        </p>
                        {property.rentals.length === 0 ? (
                            <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                No rentals yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {property.rentals.map((rental) => (
                                    <div
                                        key={rental.id}
                                        className="space-y-1 rounded-md border p-3 text-xs"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium">
                                                {rental.tenant.name}
                                            </p>
                                            <Badge variant="secondary">
                                                {rental.status}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {rental.tenant.email}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Started{" "}
                                            {formatDate(rental.startDate)}
                                            {rental.endDate &&
                                                ` · Ended ${formatDate(rental.endDate)}`}
                                        </p>
                                        {rental.currentPeriodStart &&
                                            rental.currentPeriodEnd && (
                                                <p className="text-muted-foreground">
                                                    Current period:{" "}
                                                    {formatDate(
                                                        rental.currentPeriodStart,
                                                    )}{" "}
                                                    –{" "}
                                                    {formatDate(
                                                        rental.currentPeriodEnd,
                                                    )}
                                                </p>
                                            )}
                                        <p className="text-muted-foreground">
                                            {rental.cancelAtPeriodEnd
                                                ? "Cancels at period end"
                                                : "Renews automatically"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        Close
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
