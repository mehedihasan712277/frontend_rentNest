"use client";

import { useEffect, useState, type FormEvent } from "react";

import { usePropertyStore, isValidThumbnailUrl } from "@/store/propertyStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useAmenityStore } from "@/store/amenityStore";
import { Button } from "@/components/ui/button";
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

const AddProperty = () => {
    const createProperty = usePropertyStore((state) => state.createProperty);
    const isCreating = usePropertyStore((state) => state.isCreating);

    const categories = useCategoryStore((state) => state.categories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    const amenities = useAmenityStore((state) => state.amenities);
    const fetchAmenities = useAmenityStore((state) => state.fetchAmenities);

    useEffect(() => {
        fetchCategories();
        fetchAmenities();
    }, [fetchCategories, fetchAmenities]);

    const [categoryId, setCategoryId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [area, setArea] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [amenityIds, setAmenityIds] = useState<string[]>([]);

    // Client-side checks before we even hit the API — not an operation
    // result, so they stay as plain inline messages rather than the dialog.
    const [validationError, setValidationError] = useState<string | null>(null);
    const [thumbnailError, setThumbnailError] = useState<string | null>(null);

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

    function resetForm() {
        setCategoryId("");
        setTitle("");
        setDescription("");
        setLocation("");
        setPrice("");
        setArea("");
        setThumbnail("");
        setAmenityIds([]);
        setThumbnailError(null);
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
        if (!description.trim()) {
            setValidationError("Description is required.");
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

        if (!thumbnail.trim()) {
            setValidationError("Thumbnail URL is required.");
            return;
        }
        if (!isValidThumbnailUrl(thumbnail.trim())) {
            setValidationError("Thumbnail must be an Unsplash image URL.");
            return;
        }

        const ok = await createProperty({
            categoryId,
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            price: priceNum,
            area: areaNum,
            thumbnail: thumbnail.trim(),
            amenityIds,
        });

        if (ok) {
            resetForm();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {validationError && (
                <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                    {validationError}
                </p>
            )}

            <div className="space-y-2">
                <Label htmlFor="property-category">Category</Label>
                <Select
                    value={categoryId}
                    onValueChange={(value) => setCategoryId(value ?? "")}
                >
                    <SelectTrigger id="property-category" className="w-full">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="property-title">Title</Label>
                <Input
                    id="property-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Prime Retail Shop"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="property-description">Description</Label>
                <Textarea
                    id="property-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the property"
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="property-location">Location</Label>
                <Input
                    id="property-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New Market, Dhaka"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="property-price">Price</Label>
                    <Input
                        id="property-price"
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="30000"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="property-area">Area (sqft)</Label>
                    <Input
                        id="property-area"
                        type="number"
                        min={0}
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="900"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="property-thumbnail">Thumbnail URL</Label>
                <Input
                    id="property-thumbnail"
                    value={thumbnail}
                    onChange={(e) => handleThumbnailChange(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    required
                />
                {thumbnailError && (
                    <p className="text-xs text-destructive">{thumbnailError}</p>
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
                            const selected = amenityIds.includes(amenity.id);
                            return (
                                <Badge
                                    key={amenity.id}
                                    variant={selected ? "default" : "outline"}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => toggleAmenity(amenity.id)}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            e.preventDefault();
                                            toggleAmenity(amenity.id);
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

            <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Add property"}
            </Button>
        </form>
    );
};

export default AddProperty;
