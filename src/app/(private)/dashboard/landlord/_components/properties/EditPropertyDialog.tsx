"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Pencil } from "lucide-react";

import {
    usePropertyStore,
    isValidThumbnailUrl,
    type MyProperty,
} from "@/store/propertyStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useAmenityStore } from "@/store/amenityStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

interface EditPropertyDialogProps {
    property: MyProperty;
}

export function EditPropertyDialog({ property }: EditPropertyDialogProps) {
    const updateProperty = usePropertyStore((state) => state.updateProperty);
    const updatingId = usePropertyStore((state) => state.updatingId);
    const isSubmitting = updatingId === property.id;

    const categories = useCategoryStore((state) => state.categories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    const amenities = useAmenityStore((state) => state.amenities);
    const fetchAmenities = useAmenityStore((state) => state.fetchAmenities);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            fetchCategories();
            fetchAmenities();
        }
    }, [open, fetchCategories, fetchAmenities]);

    // `my-properties` only returns amenity `name`/`description`, not `id` —
    // match by name against the full amenity list (loaded above for the
    // dropdown) to recover the ids the update payload needs. Assumes
    // amenity names are unique, same assumption the dropdown itself relies on.
    const initialAmenityIds = useMemo(() => {
        const names = new Set(property.amenities.map((a) => a.name));
        return amenities.filter((a) => names.has(a.name)).map((a) => a.id);
    }, [property.amenities, amenities]);

    const [categoryId, setCategoryId] = useState(property.categoryId);
    const [title, setTitle] = useState(property.title);
    const [description, setDescription] = useState(property.description);
    const [location, setLocation] = useState(property.location);
    const [price, setPrice] = useState(String(property.price));
    const [area, setArea] = useState(String(property.area));
    const [thumbnail, setThumbnail] = useState(property.thumbnail);
    const [amenityIds, setAmenityIds] = useState<string[]>(initialAmenityIds);
    const [thumbnailError, setThumbnailError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Reset the form to the latest values every time the dialog opens, so a
    // previous unsaved edit doesn't linger if it's reopened later.
    useEffect(() => {
        if (open) {
            setCategoryId(property.categoryId);
            setTitle(property.title);
            setDescription(property.description);
            setLocation(property.location);
            setPrice(String(property.price));
            setArea(String(property.area));
            setThumbnail(property.thumbnail);
            setThumbnailError(null);
            setValidationError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, property]);

    // Amenity ids depend on the amenity list finishing its fetch, so they're
    // synced separately once `initialAmenityIds` resolves after opening.
    useEffect(() => {
        if (open) {
            setAmenityIds(initialAmenityIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialAmenityIds.join(",")]);

    function toggleAmenity(id: string) {
        setAmenityIds((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
        );
    }

    function handleThumbnailChange(value: string) {
        setThumbnail(value);
        setThumbnailError(
            value && !isValidThumbnailUrl(value)
                ? "Thumbnail must be an Unsplash image URL (https://images.unsplash.com/...)."
                : null,
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setValidationError(null);

        if (!categoryId) {
            setValidationError("Select a category.");
            return;
        }
        if (!title.trim()) {
            setValidationError("Title is required.");
            return;
        }
        if (!location.trim()) {
            setValidationError("Location is required.");
            return;
        }

        const priceNum = Number(price);
        if (!price || Number.isNaN(priceNum) || priceNum <= 0) {
            setValidationError("Enter a valid price.");
            return;
        }

        const areaNum = Number(area);
        if (!area || Number.isNaN(areaNum) || areaNum <= 0) {
            setValidationError("Enter a valid area.");
            return;
        }

        if (!isValidThumbnailUrl(thumbnail.trim())) {
            setValidationError("Thumbnail must be an Unsplash image URL.");
            return;
        }

        const ok = await updateProperty(property.id, {
            categoryId,
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            price: priceNum,
            area: areaNum,
            thumbnail: thumbnail.trim(),
            amenityIds,
        });

        // The result message shows in the shared feedback dialog. On
        // success, close this one too; on failure, leave it open so the
        // person can fix and retry without retyping everything.
        if (ok) {
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                )}
                aria-label={`Edit ${property.title}`}
            >
                <Pencil className="size-4" />
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit property</DialogTitle>
                        <DialogDescription>
                            Update the details for &quot;{property.title}
                            &quot;.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="-mx-4 no-scrollbar max-h-[60vh] space-y-4 overflow-y-auto px-4 py-4">
                        {validationError && (
                            <p
                                role="alert"
                                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                            >
                                {validationError}
                            </p>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor={`edit-category-${property.id}`}>
                                Category
                            </Label>
                            <Select
                                value={categoryId}
                                onValueChange={(value) =>
                                    setCategoryId(value ?? "")
                                }
                            >
                                <SelectTrigger
                                    id={`edit-category-${property.id}`}
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Select a category">
                                        {(value: string | null) =>
                                            categories.find(
                                                (c) => c.id === value,
                                            )?.name ?? "Select a category"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`edit-title-${property.id}`}>
                                Title
                            </Label>
                            <Input
                                id={`edit-title-${property.id}`}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`edit-description-${property.id}`}>
                                Description
                            </Label>
                            <Textarea
                                id={`edit-description-${property.id}`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`edit-location-${property.id}`}>
                                Location
                            </Label>
                            <Input
                                id={`edit-location-${property.id}`}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`edit-price-${property.id}`}>
                                    Price
                                </Label>
                                <Input
                                    id={`edit-price-${property.id}`}
                                    type="number"
                                    min={0}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`edit-area-${property.id}`}>
                                    Area (sqft)
                                </Label>
                                <Input
                                    id={`edit-area-${property.id}`}
                                    type="number"
                                    min={0}
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`edit-thumbnail-${property.id}`}>
                                Thumbnail URL
                            </Label>
                            <Input
                                id={`edit-thumbnail-${property.id}`}
                                value={thumbnail}
                                onChange={(e) =>
                                    handleThumbnailChange(e.target.value)
                                }
                                required
                            />
                            {thumbnailError && (
                                <p className="text-xs text-destructive">
                                    {thumbnailError}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Amenities</Label>
                            {amenities.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    No amenities available yet.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {amenities.map((amenity) => {
                                        const selected = amenityIds.includes(
                                            amenity.id,
                                        );
                                        return (
                                            <Badge
                                                key={amenity.id}
                                                variant={
                                                    selected
                                                        ? "default"
                                                        : "outline"
                                                }
                                                role="button"
                                                tabIndex={0}
                                                onClick={() =>
                                                    toggleAmenity(amenity.id)
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        e.preventDefault();
                                                        toggleAmenity(
                                                            amenity.id,
                                                        );
                                                    }
                                                }}
                                                className="cursor-pointer select-none"
                                            >
                                                {amenity.name}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                            )}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </DialogClose>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
