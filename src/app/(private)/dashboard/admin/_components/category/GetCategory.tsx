"use client";

import { useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { useCategoryStore } from "@/store/categoryStore";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

function CategorySkeletonRow() {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="size-9 rounded-md" />
        </div>
    );
}

export default function GetCategory() {
    const {
        categories,
        isLoading,
        isRefetching,
        error,
        deletingId,
        fetchCategories,
        deleteCategory,
    } = useCategoryStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Categories</h2>
                {isRefetching && (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {error && (
                <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CategorySkeletonRow key={i} />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No categories yet. Create one above to get started.
                </p>
            ) : (
                <div className="space-y-3">
                    {categories.map((category) => {
                        const isDeleting = deletingId === category.id;

                        return (
                            <div
                                key={category.id}
                                className="flex items-center justify-between gap-4  border p-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {category.name}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {category.description ||
                                            "No description"}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {category?._count?.properties}{" "}
                                        {category?._count?.properties === 1 ||
                                        category?._count?.properties === 0
                                            ? "property"
                                            : "properties"}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <EditCategoryDialog category={category} />

                                    <AlertDialog>
                                        <AlertDialogTrigger
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                    size: "icon",
                                                }),
                                            )}
                                            disabled={isDeleting}
                                            aria-label={`Delete ${category.name}`}
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="size-4" />
                                            )}
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete &quot;
                                                    {category.name}&quot;?
                                                </AlertDialogTitle>

                                                <AlertDialogDescription>
                                                    This action cannot be
                                                    undone.
                                                    {category?._count
                                                        .properties > 0 && (
                                                        <>
                                                            {" "}
                                                            This category has{" "}
                                                            {
                                                                category._count
                                                                    .properties
                                                            }{" "}
                                                            linked{" "}
                                                            {category?._count
                                                                .properties ===
                                                            1
                                                                ? "property"
                                                                : "properties"}
                                                            .
                                                        </>
                                                    )}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <AlertDialogFooter>
                                                <AlertDialogCancel
                                                    disabled={isDeleting}
                                                >
                                                    Cancel
                                                </AlertDialogCancel>

                                                <AlertDialogAction
                                                    disabled={isDeleting}
                                                    onClick={() =>
                                                        deleteCategory(
                                                            category.id,
                                                        )
                                                    }
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    {isDeleting ? (
                                                        <>
                                                            <Loader2 className="size-4 animate-spin" />
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        "Delete"
                                                    )}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
