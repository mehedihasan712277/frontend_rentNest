"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

import { Property } from "@/store/propertyStore";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-md py-0">
            <div className="relative aspect-3/2 w-full bg-muted">
                {property.thumbnail ? (
                    <Image
                        src={property.thumbnail}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image
                    </div>
                )}
            </div>

            <CardHeader className="space-y-1 pt-0 pb-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug">
                        {property.title}
                    </h3>
                    {property.category?.name && (
                        <Badge variant="secondary" className="shrink-0">
                            {property.category.name}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-2 pb-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="line-clamp-1">{property.location}</span>
                </div>
                <p className="text-lg font-semibold tracking-tight">
                    ${property.price.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / month
                    </span>
                </p>
            </CardContent>

            <CardFooter className="py-0 flex">
                <Link
                    href={`/properties/${property.id}`}
                    className="w-full py-2 text-center"
                >
                    View details
                </Link>
                {/* <Button variant="outline" className="w-full">
                </Button> */}
            </CardFooter>
        </Card>
    );
}
