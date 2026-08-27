"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import { usePropertyStore } from "@/store/propertyStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useAmenityStore } from "@/store/amenityStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Base UI's Select treats empty string as "unset", so we use a sentinel.
const ALL_CATEGORIES = "__all_categories__";
const DEBOUNCE_MS = 500;

export function PropertyFilters() {
    const filters = usePropertyStore((s) => s.filters);
    const setFilter = usePropertyStore((s) => s.setFilter);
    const resetFilters = usePropertyStore((s) => s.resetFilters);
    const fetchProperties = usePropertyStore((s) => s.fetchProperties);

    const categories = useCategoryStore((s) => s.categories);
    const fetchCategories = useCategoryStore((s) => s.fetchCategories);

    const amenities = useAmenityStore((s) => s.amenities);
    const fetchAmenities = useAmenityStore((s) => s.fetchAmenities);

    useEffect(() => {
        fetchCategories();
        fetchAmenities();
    }, [fetchCategories, fetchAmenities]);

    // Debounced text fields
    const [searchInput, setSearchInput] = useState(filters.searchTerm);
    const [locationInput, setLocationInput] = useState(filters.location);
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const handle = setTimeout(() => {
            setFilter("searchTerm", searchInput);
            setFilter("location", locationInput);
            fetchProperties();
        }, DEBOUNCE_MS);

        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput, locationInput]);

    // Price fields — applied on click
    const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
    const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);
    const priceDirty =
        minPriceInput !== filters.minPrice ||
        maxPriceInput !== filters.maxPrice;

    function applyPriceFilters() {
        setFilter("minPrice", minPriceInput);
        setFilter("maxPrice", maxPriceInput);
        fetchProperties();
    }

    function handleCategoryChange(value: string | null) {
        const categoryId = !value || value === ALL_CATEGORIES ? "" : value;
        setFilter("categoryId", categoryId);
        fetchProperties();
    }

    function toggleAmenity(id: string) {
        const next = filters.amenities.includes(id)
            ? filters.amenities.filter((a) => a !== id)
            : [...filters.amenities, id];
        setFilter("amenities", next);
        fetchProperties();
    }

    function handleReset() {
        setSearchInput("");
        setLocationInput("");
        setMinPriceInput("");
        setMaxPriceInput("");
        resetFilters();
        fetchProperties();
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="property-search">Search</Label>
                <Input
                    id="property-search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Title or description"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="property-location">Location</Label>
                <Input
                    id="property-location"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. Gulshan, Dhaka"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="property-category">Category</Label>
                <Select
                    value={filters.categoryId || ALL_CATEGORIES}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger id="property-category" className="w-full">
                        <SelectValue placeholder="All categories">
                            {(value: string | null) =>
                                !value || value === ALL_CATEGORIES
                                    ? "All categories"
                                    : (categories.find((c) => c.id === value)
                                          ?.name ?? "All categories")
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_CATEGORIES}>
                            All categories
                        </SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label htmlFor="property-min-price">Min price</Label>
                    <Input
                        id="property-min-price"
                        type="number"
                        min={0}
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="property-max-price">Max price</Label>
                    <Input
                        id="property-max-price"
                        type="number"
                        min={0}
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        placeholder="No limit"
                    />
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!priceDirty}
                onClick={applyPriceFilters}
            >
                Apply price
            </Button>

            <div className="space-y-2">
                <Label>Amenities</Label>
                {amenities.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        No amenities available yet.
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity) => {
                            const selected = filters.amenities.includes(
                                amenity.id,
                            );
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

            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleReset}
            >
                <RotateCcw className="size-4" />
                Reset filters
            </Button>
        </div>
    );
}
