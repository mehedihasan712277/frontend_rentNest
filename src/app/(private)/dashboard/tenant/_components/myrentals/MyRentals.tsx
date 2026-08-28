"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, RefreshCw, Star } from "lucide-react";
import { MyRental, RentalStatus, useRentalStore } from "@/store/rentalStore";
import { useReviewStore } from "@/store/reviewStore";

const STATUS_FILTER_OPTIONS: Array<RentalStatus | "ALL"> = [
    "ALL",
    "ACTIVE",
    "CANCELED",
    "EXPIRED",
    "PAST_DUE",
];

const statusBadgeVariant = (status: RentalStatus) => {
    switch (status) {
        case "ACTIVE":
            return "default";
        case "CANCELED":
            return "destructive";
        case "EXPIRED":
            return "secondary";
        case "PAST_DUE":
            return "outline";
        default:
            return "outline";
    }
};

const formatDate = (value: string | null) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(value);

interface ReviewDialogState {
    propertyId: string;
    propertyTitle: string;
}

const MyRentals = () => {
    const {
        myRentals,
        myRentalsCount,
        isLoadingMyRentals,
        myRentalsError,
        fetchMyRentals,
    } = useRentalStore();

    const {
        myReviews,
        fetchMyReviews,
        isCreatingReview,
        createReviewError,
        createReview,
    } = useReviewStore();

    const [statusFilter, setStatusFilter] = useState<RentalStatus | "ALL">(
        "ALL",
    );

    const [reviewDialog, setReviewDialog] = useState<ReviewDialogState | null>(
        null,
    );
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    useEffect(() => {
        fetchMyRentals();
        fetchMyReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredRentals: MyRental[] = useMemo(() => {
        if (statusFilter === "ALL") return myRentals;
        return myRentals.filter((rental) => rental.status === statusFilter);
    }, [myRentals, statusFilter]);

    const reviewedPropertyIds = useMemo(
        () => new Set(myReviews.map((review) => review.propertyId)),
        [myReviews],
    );

    const handleRefresh = () => {
        fetchMyRentals();
    };

    const openReviewDialog = (rental: MyRental) => {
        setRating("");
        setComment("");
        setReviewDialog({
            propertyId: rental.propertyId,
            propertyTitle: rental.property.title,
        });
    };

    const closeReviewDialog = () => {
        if (isCreatingReview) return;
        setReviewDialog(null);
    };

    const isRatingValid = () => {
        const value = Number(rating);
        return (
            rating.trim() !== "" &&
            !Number.isNaN(value) &&
            value >= 0 &&
            value <= 5
        );
    };

    const handleSubmitReview = async () => {
        if (!reviewDialog || !isRatingValid() || comment.trim() === "") return;

        const success = await createReview({
            propertyId: reviewDialog.propertyId,
            rating: Number(rating),
            comment: comment.trim(),
        });

        if (success) {
            setReviewDialog(null);
            await fetchMyReviews();
            setSuccessDialogOpen(true);
        }
        // On failure, dialog stays open and createReviewError renders inline below.
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">My Rentals</h2>
                    <p className="text-sm text-muted-foreground">
                        {filteredRentals.length} of {myRentalsCount} rental
                        {myRentalsCount === 1 ? "" : "s"} shown
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                            setStatusFilter(value as RentalStatus | "ALL")
                        }
                    >
                        <SelectTrigger className="h-9 w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_FILTER_OPTIONS.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status === "ALL" ? "All statuses" : status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoadingMyRentals}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${
                                isLoadingMyRentals ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {myRentalsError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {myRentalsError}
                </div>
            )}

            <div className="rounded-md border">
                {/* Header row — only visible on md+ where columns line up */}
                <div className="hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2.5fr_1fr_2fr_1fr_1.5fr]">
                    <span>Property</span>
                    <span>Status</span>
                    <span>Period</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Review</span>
                </div>

                <div className="divide-y">
                    {isLoadingMyRentals && myRentals.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-4 py-3">
                                <Skeleton className="h-14 w-full" />
                            </div>
                        ))
                    ) : filteredRentals.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            {myRentals.length === 0
                                ? "You don't have any rentals yet."
                                : "No rentals match this status."}
                        </div>
                    ) : (
                        filteredRentals.map((rental) => {
                            const alreadyReviewed = reviewedPropertyIds.has(
                                rental.propertyId,
                            );

                            return (
                                <div
                                    key={rental.id}
                                    className="flex flex-col gap-3 px-4 py-3 md:grid md:grid-cols-[2.5fr_1fr_2fr_1fr_1.5fr] md:items-center md:gap-2"
                                >
                                    {/* Property */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                            {rental.property.thumbnail ? (
                                                <Image
                                                    src={
                                                        rental.property
                                                            .thumbnail
                                                    }
                                                    alt={rental.property.title}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            ) : null}
                                        </div>
                                        <div className="flex min-w-0 flex-col">
                                            <span className="truncate font-medium">
                                                {rental.property.title}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {rental.property.location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground md:hidden">
                                            Status:
                                        </span>
                                        <Badge
                                            variant={statusBadgeVariant(
                                                rental.status,
                                            )}
                                        >
                                            {rental.status}
                                        </Badge>
                                    </div>

                                    {/* Period */}
                                    <div className="flex flex-col text-sm">
                                        <span className="text-xs text-muted-foreground md:hidden">
                                            Period
                                        </span>
                                        <span>
                                            {formatDate(
                                                rental.currentPeriodStart,
                                            )}
                                            {" – "}
                                            {formatDate(
                                                rental.currentPeriodEnd,
                                            )}
                                        </span>
                                        {rental.cancelAtPeriodEnd && (
                                            <span className="text-xs text-destructive">
                                                Cancels at period end
                                            </span>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between text-sm md:block md:text-right">
                                        <span className="text-muted-foreground md:hidden">
                                            Price
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                rental.property.price,
                                            )}
                                        </span>
                                    </div>

                                    {/* Review action */}
                                    <div className="flex items-center justify-between md:justify-end">
                                        <span className="text-xs text-muted-foreground md:hidden">
                                            Review
                                        </span>
                                        {rental.status === "ACTIVE" ? (
                                            <Button
                                                size="sm"
                                                variant={
                                                    alreadyReviewed
                                                        ? "outline"
                                                        : "default"
                                                }
                                                disabled={alreadyReviewed}
                                                onClick={() =>
                                                    openReviewDialog(rental)
                                                }
                                            >
                                                <Star className="mr-1.5 h-3.5 w-3.5" />
                                                {alreadyReviewed
                                                    ? "Reviewed"
                                                    : "Write a review"}
                                            </Button>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Write a review dialog */}
            <Dialog
                open={reviewDialog !== null}
                onOpenChange={(open) => {
                    if (!open) closeReviewDialog();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Write a review</DialogTitle>
                        <DialogDescription>
                            {reviewDialog && (
                                <>
                                    Share your experience with{" "}
                                    <span className="font-medium">
                                        {reviewDialog.propertyTitle}
                                    </span>
                                    .
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="review-rating">Rating (0–5)</Label>
                            <Input
                                id="review-rating"
                                type="number"
                                min={0}
                                max={5}
                                step={0.5}
                                placeholder="e.g. 4.5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                disabled={isCreatingReview}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="review-comment">Comment</Label>
                            <Textarea
                                id="review-comment"
                                placeholder="How was your stay?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={isCreatingReview}
                                rows={4}
                            />
                        </div>

                        {createReviewError && (
                            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                                {createReviewError}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={closeReviewDialog}
                            disabled={isCreatingReview}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitReview}
                            disabled={
                                isCreatingReview ||
                                !isRatingValid() ||
                                comment.trim() === ""
                            }
                        >
                            {isCreatingReview && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Submit review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success alert dialog */}
            <AlertDialog
                open={successDialogOpen}
                onOpenChange={setSuccessDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Review submitted</AlertDialogTitle>
                        <AlertDialogDescription>
                            Thanks for your feedback — your review has been
                            posted successfully.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setSuccessDialogOpen(false)}
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MyRentals;
