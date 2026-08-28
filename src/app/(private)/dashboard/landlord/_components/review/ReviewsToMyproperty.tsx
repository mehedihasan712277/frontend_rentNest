"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { ReviewStatus, useReviewStore } from "@/store/reviewStore";

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

const ReviewsToMyproperty = () => {
    const {
        reviewsToMyProperties,
        reviewsToMyPropertiesCount,
        isLoadingReviewsToMyProperties,
        reviewsToMyPropertiesError,
        fetchReviewsToMyProperties,
    } = useReviewStore();

    useEffect(() => {
        fetchReviewsToMyProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRefresh = () => {
        fetchReviewsToMyProperties();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Reviews on My Properties
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {reviewsToMyPropertiesCount} review
                        {reviewsToMyPropertiesCount === 1 ? "" : "s"} total
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoadingReviewsToMyProperties}
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                            isLoadingReviewsToMyProperties ? "animate-spin" : ""
                        }`}
                    />
                    Refresh
                </Button>
            </div>

            {reviewsToMyPropertiesError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {reviewsToMyPropertiesError}
                </div>
            )}

            <div className="rounded-md border">
                {/* Header row — only visible on md+ where columns line up */}
                <div className="hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2fr_1.5fr_3fr_0.75fr_1fr]">
                    <span>Property</span>
                    <span>Tenant</span>
                    <span>Comment</span>
                    <span>Rating</span>
                    <span>Status</span>
                </div>

                <div className="divide-y">
                    {isLoadingReviewsToMyProperties &&
                    reviewsToMyProperties.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-4 py-3">
                                <Skeleton className="h-14 w-full" />
                            </div>
                        ))
                    ) : reviewsToMyProperties.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No reviews on your properties yet.
                        </div>
                    ) : (
                        reviewsToMyProperties.map((review) => (
                            <div
                                key={review.id}
                                className="flex flex-col gap-3 px-4 py-3 md:grid md:grid-cols-[2fr_1.5fr_3fr_0.75fr_1fr] md:items-center md:gap-2"
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

                                {/* Tenant */}
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Tenant
                                    </span>
                                    <span className="truncate text-sm font-medium">
                                        {review.tenant.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {review.tenant.email}
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsToMyproperty;
