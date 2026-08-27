"use client";

import { useEffect } from "react";
import { Filter } from "lucide-react";

import { usePropertyStore } from "@/store/propertyStore";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyFilters } from "./_components/PropertyFilters";
import { PropertyCard } from "./_components/PropertyCard";
import { cn } from "@/lib/utils";

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

export default function PropertiesPage() {
    const properties = usePropertyStore((s) => s.properties);
    const isLoading = usePropertyStore((s) => s.isLoading);
    const isRefetching = usePropertyStore((s) => s.isRefetching);
    const fetchError = usePropertyStore((s) => s.fetchError);
    const fetchProperties = usePropertyStore((s) => s.fetchProperties);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Properties
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Browse available rental properties
                    </p>
                </div>

                {/* Mobile filter trigger */}
                <Sheet>
                    <SheetTrigger
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "sm",
                            }),
                            "lg:hidden",
                        )}
                    >
                        <Filter className="size-4" />
                        Filters
                    </SheetTrigger>
                    <SheetContent side="left" className="w-75 sm:w-85 px-4">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                            <PropertyFilters />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex gap-8">
                {/* Desktop sidebar */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-8 rounded-xl border p-5">
                        <h2 className="mb-4 text-sm font-semibold">Filters</h2>
                        <PropertyFilters />
                    </div>
                </aside>

                {/* Main content */}
                <div className="min-w-0 flex-1">
                    {fetchError && (
                        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {fetchError}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <PropertyCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
                            <p className="text-lg font-medium">
                                No properties found
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Try adjusting your filters
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {properties.length} propert
                                    {properties.length === 1 ? "y" : "ies"}{" "}
                                    found
                                    {isRefetching && (
                                        <span className="ml-2 inline-block size-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    )}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {properties.map((property) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
