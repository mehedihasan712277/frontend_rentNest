"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Ruler, User } from "lucide-react";

import { usePropertyStore } from "@/store/propertyStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function PropertyDetailsSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="mt-6 space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    );
}

const PropertyDetailsPage = () => {
    const params = useParams<{ id: string }>();
    const { id } = params;

    const selectedProperty = usePropertyStore((s) => s.selectedProperty);
    const isLoadingDetails = usePropertyStore((s) => s.isLoadingDetails);
    const detailsError = usePropertyStore((s) => s.detailsError);
    const fetchPropertyDetails = usePropertyStore(
        (s) => s.fetchPropertyDetails,
    );
    const clearPropertyDetails = usePropertyStore(
        (s) => s.clearPropertyDetails,
    );

    useEffect(() => {
        if (id) fetchPropertyDetails(id);

        // Clear stale details when leaving the page / switching ids
        return () => clearPropertyDetails();
    }, [id, fetchPropertyDetails, clearPropertyDetails]);

    if (isLoadingDetails) {
        return <PropertyDetailsSkeleton />;
    }

    if (detailsError) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
                <p className="text-lg font-medium text-destructive">
                    {detailsError}
                </p>
                <Button onClick={() => id && fetchPropertyDetails(id)}>
                    Try again
                </Button>
            </div>
        );
    }

    if (!selectedProperty) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4 py-20 text-center">
                <p className="text-lg font-medium">Property not found</p>
            </div>
        );
    }

    const {
        title,
        description,
        location,
        price,
        area,
        thumbnail,
        status,
        category,
        amenities,
        landlord,
    } = selectedProperty;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main content */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-xl border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={thumbnail}
                            alt={title}
                            className="aspect-video w-full object-cover"
                        />
                    </div>

                    <div className="mt-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                {title}
                            </h1>
                            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="size-4" />
                                {location}
                            </p>
                        </div>
                        <Badge
                            variant={
                                status === "AVAILABLE" ? "default" : "secondary"
                            }
                        >
                            {status === "AVAILABLE"
                                ? "Available"
                                : "Not available"}
                        </Badge>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Ruler className="size-4" />
                            {area} sqft
                        </span>
                        <span>{category?.name}</span>
                    </div>

                    <div className="mt-6">
                        <h2 className="mb-2 text-lg font-semibold">
                            Description
                        </h2>
                        <p className="whitespace-pre-line text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {amenities?.length > 0 && (
                        <div className="mt-6">
                            <h2 className="mb-2 text-lg font-semibold">
                                Amenities
                            </h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {amenities.map((amenity) => (
                                    <div
                                        key={amenity.name}
                                        className="rounded-lg border p-3"
                                    >
                                        <p className="text-sm font-medium">
                                            {amenity.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {amenity.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside>
                    <div className="sticky top-8 rounded-xl border p-5">
                        <p className="text-2xl font-bold">
                            ${price.toLocaleString()}
                            <span className="text-sm font-normal text-muted-foreground">
                                /mo
                            </span>
                        </p>

                        <div className="mt-4 flex items-center gap-2 border-t pt-4 text-sm">
                            <User className="size-4 text-muted-foreground" />
                            <span>{landlord?.name}</span>
                        </div>

                        <Button className="mt-6 w-full">Request to rent</Button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PropertyDetailsPage;
