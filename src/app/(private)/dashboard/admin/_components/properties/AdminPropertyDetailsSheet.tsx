"use client";

import { useState } from "react";
import { Info } from "lucide-react";

import { type AdminProperty } from "@/store/propertyStore";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AdminPropertyDetailsSheetProps {
    property: AdminProperty;
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

function statusBadgeClass(status: string) {
    return status === "AVAILABLE"
        ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
        : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400";
}

/**
 * Shows every meaningful field on an `AdminProperty` — no raw ids (property,
 * landlord, category, Stripe), same convention as the landlord-facing
 * `PropertyDetailsDialog`. Purely a display of data already held in the
 * store from `GET /properties/admin` — no fetch happens here.
 *
 * Note: unlike the landlord-facing `my-properties` endpoint, the admin
 * endpoint's nested rental requests / reviews / rentals do NOT include a
 * `tenant` relation (name/email) — only `tenantId`. So those are shown
 * here instead of a tenant name.
 */
export function AdminPropertyDetailsSheet({
    property,
}: AdminPropertyDetailsSheetProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                )}
            >
                <Info className="size-4" />
                Details
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-full gap-0 overflow-y-auto sm:max-w-lg"
            >
                <SheetHeader>
                    <SheetTitle>{property.title}</SheetTitle>
                    <SheetDescription>
                        Full details for this property.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-5 px-4 pb-6">
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
                            <Badge
                                variant="outline"
                                className={statusBadgeClass(property.status)}
                            >
                                {property.status}
                            </Badge>
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

                    <div className="rounded-md bg-muted/50 p-3 text-sm">
                        <p className="text-xs text-muted-foreground">
                            Landlord
                        </p>
                        <p className="font-medium">{property.landlord.name}</p>
                        <p className="text-muted-foreground">
                            {property.landlord.email}
                        </p>
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
                                        key={amenity.id}
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
                                                Tenant ID: {request.tenantId}
                                            </p>
                                            <Badge variant="secondary">
                                                {request.status}
                                            </Badge>
                                        </div>
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
                                                Tenant ID: {review.tenantId} ·{" "}
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
                                                Tenant ID: {rental.tenantId}
                                            </p>
                                            <Badge variant="secondary">
                                                {rental.status}
                                            </Badge>
                                        </div>
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
            </SheetContent>
        </Sheet>
    );
}
