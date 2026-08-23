"use client";

import { Info } from "lucide-react";

import type { Amenity } from "@/store/amenityStore";
import { buttonVariants } from "@/components/ui/button";
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

interface AmenityMetaDetailsProps {
    amenity: Amenity;
}

export function AmenityMetaDetails({ amenity }: AmenityMetaDetailsProps) {
    return (
        <Dialog>
            <DialogTrigger
                className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                )}
                aria-label={`View details for ${amenity.name}`}
            >
                <Info className="size-4" />
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>{amenity.name}</DialogTitle>
                    <DialogDescription>
                        Amenity details and linked properties.
                    </DialogDescription>
                </DialogHeader>

                <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
                    <div className="space-y-5 py-2">
                        <p className="text-sm text-muted-foreground">
                            {amenity.description || "No description"}
                        </p>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Properties ({amenity.properties.length})
                            </p>
                            {amenity.properties.length === 0 ? (
                                <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                    No properties linked yet.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {amenity.properties.map((property, i) => (
                                        <div
                                            key={`${property.title}-${i}`}
                                            className="rounded-md border p-3"
                                        >
                                            <p className="font-medium">
                                                {property.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
