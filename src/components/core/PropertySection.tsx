"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { usePropertyStore } from "@/store/propertyStore";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PropertyCard } from "@/app/(public)/properties/_components/PropertyCard";

function PropertyCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border">
            <Skeleton className="aspect-3/2 w-full" />
            <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-9 w-full" />
            </div>
        </div>
    );
}

export function PropertySection() {
    const properties = usePropertyStore((s) => s.properties);
    const isLoading = usePropertyStore((s) => s.isLoading);
    const fetchError = usePropertyStore((s) => s.fetchError);
    const fetchProperties = usePropertyStore((s) => s.fetchProperties);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // Only show the first 3 properties in this section
    const featuredProperties = properties.slice(0, 3);

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Featured Properties
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    A handpicked selection of our available rental properties
                </p>
            </div>

            {fetchError && (
                <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {fetchError}
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <PropertyCardSkeleton key={i} />
                    ))}
                </div>
            ) : featuredProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                    <p className="text-lg font-medium">No properties found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Check back soon for new listings
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}

            <div className="mt-10 flex justify-center">
                <Link
                    href="/properties"
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "gap-2",
                    )}
                >
                    View All
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </section>
    );
}
