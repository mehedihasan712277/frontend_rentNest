"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import { MyReview, ReviewStatus, useReviewStore } from "@/store/reviewStore";

const statusBadgeVariant = (status: ReviewStatus) => {
    switch (status) {
        case "APPROVED":
            return "default";
        case "CANCELED":
            return "destructive";
        default:
            return "outline";
    }
};

const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

interface PendingDelete {
    id: string;
    propertyTitle: string;
}

interface ResultDialog {
    type: "success" | "error";
    message: string;
}

const MyGivenReviews = () => {
    const {
        myReviews,
        myReviewsCount,
        isLoadingMyReviews,
        myReviewsError,
        fetchMyReviews,
        isDeletingReview,
        deleteReview,
    } = useReviewStore();

    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
        null,
    );
    const [resultDialog, setResultDialog] = useState<ResultDialog | null>(null);

    useEffect(() => {
        fetchMyReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRefresh = () => {
        fetchMyReviews();
    };

    const handleDeleteClick = (review: MyReview) => {
        setPendingDelete({
            id: review.id,
            propertyTitle: review.property.title,
        });
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;

        const { id, propertyTitle } = pendingDelete;
        const success = await deleteReview(id);

        setPendingDelete(null);

        if (success) {
            await fetchMyReviews();
            setResultDialog({
                type: "success",
                message: `Your review for "${propertyTitle}" was deleted.`,
            });
        } else {
            const errMessage =
                useReviewStore.getState().deleteReviewError ??
                "Something went wrong while deleting the review.";
            setResultDialog({ type: "error", message: errMessage });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">My Reviews</h2>
                    <p className="text-sm text-muted-foreground">
                        {myReviewsCount} review
                        {myReviewsCount === 1 ? "" : "s"} total
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoadingMyReviews}
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                            isLoadingMyReviews ? "animate-spin" : ""
                        }`}
                    />
                    Refresh
                </Button>
            </div>

            {myReviewsError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {myReviewsError}
                </div>
            )}

            <div className="rounded-md border">
                {/* Header row — only visible on md+ where columns line up */}
                <div className="hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2fr_1.5fr_3fr_0.75fr_1fr_0.75fr]">
                    <span>Property</span>
                    <span>Landlord</span>
                    <span>Comment</span>
                    <span>Rating</span>
                    <span>Status</span>
                    <span className="text-right">Action</span>
                </div>

                <div className="divide-y">
                    {isLoadingMyReviews && myReviews.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-4 py-3">
                                <Skeleton className="h-14 w-full" />
                            </div>
                        ))
                    ) : myReviews.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            You haven&apos;t written any reviews yet.
                        </div>
                    ) : (
                        myReviews.map((review) => (
                            <div
                                key={review.id}
                                className="flex flex-col gap-3 px-4 py-3 md:grid md:grid-cols-[2fr_1.5fr_3fr_0.75fr_1fr_0.75fr] md:items-center md:gap-2"
                            >
                                {/* Property */}
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {review.property.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>

                                {/* Landlord */}
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Landlord
                                    </span>
                                    <span className="truncate text-sm">
                                        {review.property.landlord.name}
                                    </span>
                                </div>

                                {/* Comment */}
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Comment
                                    </span>
                                    <span className="text-sm">
                                        {review.comment}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center justify-between text-sm md:block">
                                    <span className="text-muted-foreground md:hidden">
                                        Rating
                                    </span>
                                    <span className="font-medium">
                                        {review.rating} / 5
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Status:
                                    </span>
                                    <Badge
                                        variant={statusBadgeVariant(
                                            review.status,
                                        )}
                                    >
                                        {review.status}
                                    </Badge>
                                </div>

                                {/* Action */}
                                <div className="flex items-center justify-between md:justify-end">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Action
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            handleDeleteClick(review)
                                        }
                                        disabled={
                                            isDeletingReview &&
                                            pendingDelete?.id === review.id
                                        }
                                    >
                                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Confirmation dialog before deleting */}
            <AlertDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingDelete && (
                                <>
                                    You&apos;re about to permanently delete your
                                    review for{" "}
                                    <span className="font-medium">
                                        {pendingDelete.propertyTitle}
                                    </span>
                                    . This action cannot be undone.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingReview}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmDelete();
                            }}
                            disabled={isDeletingReview}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeletingReview && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success / error result dialog */}
            <AlertDialog
                open={resultDialog !== null}
                onOpenChange={(open) => {
                    if (!open) setResultDialog(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {resultDialog?.type === "success"
                                ? "Success"
                                : "Error"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {resultDialog?.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setResultDialog(null)}
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MyGivenReviews;
