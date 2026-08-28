import { MapPin, Ruler, User } from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { RequestToRentButton } from "../_components/RequestToRentButton";

interface PropertyCategory {
    name: string;
}

interface PropertyAmenity {
    name: string;
    description: string;
}

interface PropertyLandlord {
    name: string;
}

interface PropertyDetail {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    area: number;
    thumbnail: string;
    status: string;
    category: PropertyCategory | null;
    amenities: PropertyAmenity[];
    landlord: PropertyLandlord | null;
}

interface GetPropertyDetailsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: PropertyDetail;
}

/**
 * Fetched directly on the server rather than through `usePropertyStore`,
 * since that store is a client-side Zustand hook. If this endpoint needs
 * an auth token, forward it here (e.g. reading it from cookies via
 * `next/headers`) instead of relying on the axios-client interceptor,
 * which only runs in the browser.
 */
async function getPropertyDetails(id: string): Promise<PropertyDetail | null> {
    const res = await fetch(
        `${process.env.API_BASE_URL}/api/properties/${id}`,
        { cache: "no-store" },
    );

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Could not load property details.");

    const json: GetPropertyDetailsResponse = await res.json();
    return json.data;
}

interface PropertyDetailsPageProps {
    // Next.js 15+ passes route params as a Promise. On Next 14, change this
    // to `{ id: string }` and drop the `await` below.
    params: Promise<{ id: string }>;
}

const PropertyDetailsPage = async ({ params }: PropertyDetailsPageProps) => {
    const { id } = await params;

    let property: PropertyDetail | null = null;
    let loadError: string | null = null;

    try {
        property = await getPropertyDetails(id);
    } catch {
        loadError = "Could not load property details.";
    }

    if (loadError) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
                <p className="text-lg font-medium text-destructive">
                    {loadError}
                </p>
            </div>
        );
    }

    if (!property) {
        notFound();
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
    } = property;

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

                        <RequestToRentButton propertyId={id} />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PropertyDetailsPage;
