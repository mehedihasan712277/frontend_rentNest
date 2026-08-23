"use client";

import { useState, type FormEvent } from "react";

import { useCategoryStore } from "@/store/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateCategoryForm() {
    const createCategory = useCategoryStore((state) => state.createCategory);
    const isCreating = useCategoryStore((state) => state.isCreating);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    // Client-side check before we even hit the API — not an operation
    // result, so it stays as a plain inline message rather than the dialog.
    const [validationError, setValidationError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setValidationError(null);

        if (!name.trim()) {
            setValidationError("Category name is required.");
            return;
        }

        const ok = await createCategory({
            name: name.trim(),
            description: description.trim() || undefined,
        });

        if (ok) {
            setName("");
            setDescription("");
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
                <Label htmlFor="category-name">Name</Label>
                <Input
                    id="category-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shop"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                    id="category-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What kind of properties belong in this category?"
                    rows={4}
                />
            </div>

            <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create category"}
            </Button>
        </form>
    );
}
