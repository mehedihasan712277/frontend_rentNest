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

// Base UI's Select can't use an empty string as an item value (it's the
// "unset" sentinel), so "no filter" is represented with this and converted
// to "" before it reaches the store.
const ALL_CATEGORIES = "__all_categories__";
const ALL_STATUSES = "__all_statuses__";

const DEBOUNCE_MS = 500;

export function AdminPropertyFilters() {
    const adminFilters = usePropertyStore((state) => state.adminFilters);
    const setAdminFilter = usePropertyStore((state) => state.setAdminFilter);
    const resetAdminFilters = usePropertyStore(
        (state) => state.resetAdminFilters,
    );
    const fetchAdminProperties = usePropertyStore(
        (state) => state.fetchAdminProperties,
    );

    const categories = useCategoryStore((state) => state.categories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    const amenities = useAmenityStore((state) => state.amenities);
    const fetchAmenities = useAmenityStore((state) => state.fetchAmenities);

    useEffect(() => {
        fetchCategories();
        fetchAmenities();
    }, [fetchCategories, fetchAmenities]);

    // --- Debounced text fields (searchTerm, location) ---------------------
    const [searchInput, setSearchInput] = useState(adminFilters.searchTerm);
    const [locationInput, setLocationInput] = useState(adminFilters.location);
    const isFirstRun = useRef(true);

    useEffect(() => {
        // Skip on mount — nothing to debounce yet, and we don't want a
        // duplicate fetch alongside the initial load in the list component.
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const handle = setTimeout(() => {
            setAdminFilter("searchTerm", searchInput);
            setAdminFilter("location", locationInput);
            fetchAdminProperties();
        }, DEBOUNCE_MS);

        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput, locationInput]);

    // --- Price fields (applied on click, not auto) -------------------------
    const [minPriceInput, setMinPriceInput] = useState(adminFilters.minPrice);
    const [maxPriceInput, setMaxPriceInput] = useState(adminFilters.maxPrice);
    const priceDirty =
        minPriceInput !== adminFilters.minPrice ||
        maxPriceInput !== adminFilters.maxPrice;

    function applyPriceFilters() {
        setAdminFilter("minPrice", minPriceInput);
        setAdminFilter("maxPrice", maxPriceInput);
        fetchAdminProperties();
    }

    // --- Instant filters (category, status, amenities) ---------------------
    function handleCategoryChange(value: string | null) {
        const categoryId = !value || value === ALL_CATEGORIES ? "" : value;
        setAdminFilter("categoryId", categoryId);
        fetchAdminProperties();
    }

    function handleStatusChange(value: string | null) {
        const status =
            !value || value === ALL_STATUSES
                ? ""
                : (value as "AVAILABLE" | "NOTAVAILABLE");
        setAdminFilter("status", status);
        fetchAdminProperties();
    }

    function toggleAmenity(id: string) {
        const next = adminFilters.amenities.includes(id)
            ? adminFilters.amenities.filter((a) => a !== id)
            : [...adminFilters.amenities, id];
        setAdminFilter("amenities", next);
        fetchAdminProperties();
    }

    function handleReset() {
        setSearchInput("");
        setLocationInput("");
        setMinPriceInput("");
        setMaxPriceInput("");
        resetAdminFilters();
        fetchAdminProperties();
    }

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="admin-property-search">Search</Label>
                    <Input
                        id="admin-property-search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Title or description"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="admin-property-location">Location</Label>
                    <Input
                        id="admin-property-location"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="e.g. Gulshan, Dhaka"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="admin-property-category">Category</Label>
                    <Select
                        value={adminFilters.categoryId || ALL_CATEGORIES}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger
                            id="admin-property-category"
                            className="w-full"
                        >
                            <SelectValue placeholder="All categories">
                                {(value: string | null) =>
                                    !value || value === ALL_CATEGORIES
                                        ? "All categories"
                                        : (categories.find(
                                              (c) => c.id === value,
                                          )?.name ?? "All categories")
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_CATEGORIES}>
                                All categories
                            </SelectItem>
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
                    <Label htmlFor="admin-property-status">Status</Label>
                    <Select
                        value={adminFilters.status || ALL_STATUSES}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger
                            id="admin-property-status"
                            className="w-full"
                        >
                            <SelectValue placeholder="All statuses">
                                {(value: string | null) =>
                                    !value || value === ALL_STATUSES
                                        ? "All statuses"
                                        : value
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_STATUSES}>
                                All statuses
                            </SelectItem>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="NOTAVAILABLE">
                                Not available
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="admin-property-min-price">Min price</Label>
                    <Input
                        id="admin-property-min-price"
                        type="number"
                        min={0}
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="admin-property-max-price">
                            Max price
                        </Label>
                        <Input
                            id="admin-property-max-price"
                            type="number"
                            min={0}
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            placeholder="No limit"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!priceDirty}
                        onClick={applyPriceFilters}
                    >
                        Apply
                    </Button>
                </div>
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
                            const selected = adminFilters.amenities.includes(
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

            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                >
                    <RotateCcw className="size-4" />
                    Reset filters
                </Button>
            </div>
        </div>
    );
}
