"use client";

import { useState, type FormEvent } from "react";

import { api } from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Category {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

interface CreateCategoryFormProps {
    onCreated?: (category: Category) => void;
}

export function CreateCategoryForm({ onCreated }: CreateCategoryFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post<{
                success: boolean;
                message: string;
                data: Category;
            }>("/categories", {
                name: name.trim(),
                description: description.trim() || undefined,
            });

            setSuccess(`"${res.data.data.name}" was created.`);
            setName("");
            setDescription("");
            onCreated?.(res.data.data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not create the category.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
                <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                    {error}
                </p>
            )}
            {success && (
                <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                    {success}
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

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create category"}
            </Button>
        </form>
    );
}
