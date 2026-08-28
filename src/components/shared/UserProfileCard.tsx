"use client";

import { useEffect } from "react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfileStore } from "@/store/userStore";

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function UserProfileCard() {
    const { profile, isLoading, error, fetchProfile } = useUserProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (isLoading && !profile) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    Loading profile...
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-sm text-destructive">
                    {error}
                </CardContent>
            </Card>
        );
    }

    if (!profile) return null;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex items-start gap-4">
                    {profile.profile.profilePhoto ? (
                        <Image
                            src={profile.profile.profilePhoto}
                            alt={profile.name}
                            width={64}
                            height={64}
                            className="size-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted text-lg font-medium">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="space-y-1">
                        <p className="text-lg font-semibold">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {profile.email}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                            <span className="rounded-full border px-2 py-0.5 text-xs font-medium">
                                {profile.role}
                            </span>
                            <span
                                className={
                                    "rounded-full px-2 py-0.5 text-xs font-medium " +
                                    (profile.status === "ACTIVE"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-destructive/10 text-destructive")
                                }
                            >
                                {profile.status}
                            </span>
                        </div>
                        {profile.profile.bio && (
                            <p className="pt-2 text-sm text-muted-foreground">
                                {profile.profile.bio}
                            </p>
                        )}
                        <p className="pt-2 text-xs text-muted-foreground">
                            Member since {formatDate(profile.createdAt)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* LANDLORD: properties they manage */}
            {profile.role === "LANDLORD" && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Properties ({profile.properties.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {profile.properties.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No properties listed yet.
                            </p>
                        )}
                        {profile.properties.map((property) => (
                            <div
                                key={property.id}
                                className="rounded-md border p-3"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">
                                        {property.title}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                        {property.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {property.location}
                                </p>
                                <p className="text-sm">
                                    ${property.price.toLocaleString()} ·{" "}
                                    {property.area} sq ft
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* ADMIN + LANDLORD: amenities they created */}
            {(profile.role === "ADMIN" || profile.role === "LANDLORD") && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Amenities created ({profile.amenity.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {profile.amenity.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No amenities created yet.
                            </p>
                        )}
                        {profile.amenity.map((amenity) => (
                            <div
                                key={amenity.id}
                                className="rounded-md border p-3"
                            >
                                <p className="font-medium">{amenity.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {amenity.description}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* TENANT: rentals, rental requests, reviews */}
            {profile.role === "TENANT" && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Rentals ({profile.rentals?.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {profile.rentals?.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No active rentals.
                                </p>
                            )}
                            {profile.rentals?.map((rental) => (
                                <div
                                    key={rental.id}
                                    className="rounded-md border p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">
                                            Rental #{rental.id.slice(0, 8)}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                            {rental.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Started {formatDate(rental.startDate)}
                                        {rental.endDate
                                            ? ` · Ends ${formatDate(rental.endDate)}`
                                            : ""}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Rental requests ({profile.rentalRequests.length}
                                )
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {profile.rentalRequests.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No rental requests yet.
                                </p>
                            )}
                            {profile.rentalRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="rounded-md border p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">
                                            {request.message}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                            {request.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Reviews ({profile.reviews.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {profile.reviews.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No reviews written yet.
                                </p>
                            )}
                            {profile.reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-md border p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">
                                            {review.rating.toFixed(1)} ★
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                            {review.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
