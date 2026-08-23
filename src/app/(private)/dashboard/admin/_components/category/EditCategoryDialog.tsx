"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Pencil } from "lucide-react";

import { useCategoryStore, type Category } from "@/store/categoryStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface EditCategoryDialogProps {
    category: Category;
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
    const updateCategory = useCategoryStore((state) => state.updateCategory);
    const updatingId = useCategoryStore((state) => state.updatingId);
    const isSubmitting = updatingId === category.id;

    const [open, setOpen] = useState(false);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);

    // Reset the form to the latest values every time the dialog opens, so a
    // previous unsaved edit doesn't linger if it's reopened later.
    useEffect(() => {
        if (open) {
            setName(category.name);
            setDescription(category.description);
        }
    }, [open, category.name, category.description]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!name.trim()) return;

        const ok = await updateCategory(category.id, {
            name: name.trim(),
            description: description.trim(),
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
                aria-label={`Edit ${category.name}`}
            >
                <Pencil className="size-4" />
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-2rem)] max-w-md sm:w-full">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit category</DialogTitle>
                        <DialogDescription>
                            Update the name and description for &quot;
                            {category.name}&quot;.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor={`edit-name-${category.id}`}>
                                Name
                            </Label>
                            <Input
                                id={`edit-name-${category.id}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Shop"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`edit-description-${category.id}`}>
                                Description
                            </Label>
                            <Textarea
                                id={`edit-description-${category.id}`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What kind of properties belong in this category?"
                                rows={4}
                            />
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
