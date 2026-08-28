"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2, RefreshCw, Trash2 } from "lucide-react";

import {
    SentRentalRequest,
    useRentalRequestStore,
} from "@/store/rentalRequestStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const statusVariant: Record<
    SentRentalRequest["status"],
    "default" | "secondary" | "destructive" | "outline"
> = {
    PENDING: "secondary",
    APPROVED: "default",
    REJECTED: "destructive",
    COMPLETED: "default",
    DELETED: "outline",
};

function SentRequestCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
    );
}

interface SentRequestCardProps {
    request: SentRentalRequest;
}

function SentRequestCard({ request }: SentRequestCardProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const tenantDeletingId = useRentalRequestStore((s) => s.tenantDeletingId);
    const tenantDeleteRequest = useRentalRequestStore(
        (s) => s.tenantDeleteRequest,
    );
    const subscribingId = useRentalRequestStore((s) => s.subscribingId);
    const subscribeToRentalRequest = useRentalRequestStore(
        (s) => s.subscribeToRentalRequest,
    );

    const isDeleting = tenantDeletingId === request.id;
    const isSubscribing = subscribingId === request.id;
    const isApproved = request.status === "APPROVED";
    const isWithdraw = request.status === "PENDING";

    const handleConfirmDelete = async () => {
        const ok = await tenantDeleteRequest(request.id);
        if (ok) setConfirmOpen(false);
    };

    const handleSubscribe = () => {
        subscribeToRentalRequest(request.id);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <h3 className="font-semibold leading-none">
                        {request.property.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Landlord: {request.property.landlord.name}
                    </p>
                </div>
                <Badge variant={statusVariant[request.status]}>
                    {request.status}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    {request.message}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>${request.property.price.toLocaleString()}/mo</span>
                    <span>{request.property.area} sqft</span>
                    <span>
                        Sent {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {isApproved ? (
                    <Button
                        size="sm"
                        onClick={handleSubscribe}
                        disabled={isSubscribing}
                    >
                        {isSubscribing ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Redirecting…
                            </>
                        ) : (
                            <>
                                <CreditCard className="size-4" />
                                Subscribe
                            </>
                        )}
                    </Button>
                ) : (
                    <AlertDialog
                        open={confirmOpen}
                        onOpenChange={setConfirmOpen}
                    >
                        <AlertDialogTrigger
                            className={cn(
                                buttonVariants({
                                    variant: isWithdraw
                                        ? "default"
                                        : "destructive",
                                    size: "sm",
                                }),
                                isWithdraw &&
                                    "bg-yellow-500 text-yellow-950 hover:bg-yellow-600",
                                "disabled:pointer-events-none disabled:opacity-50",
                            )}
                            disabled={
                                isDeleting || request.status === "DELETED"
                            }
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    {isWithdraw ? "Withdrawing…" : "Deleting…"}
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-4" />
                                    {isWithdraw ? "Withdraw" : "Delete request"}
                                </>
                            )}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {isWithdraw
                                        ? "Withdraw this rental request?"
                                        : "Delete this rental request?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {isWithdraw ? (
                                        <>
                                            This will withdraw your pending
                                            request for &ldquo;
                                            {request.property.title}&rdquo;. The
                                            landlord will no longer see it. This
                                            can&apos;t be undone.
                                        </>
                                    ) : (
                                        <>
                                            This will permanently remove your
                                            request for &ldquo;
                                            {request.property.title}&rdquo; from
                                            your history. This can&apos;t be
                                            undone.
                                        </>
                                    )}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleConfirmDelete();
                                    }}
                                    disabled={isDeleting}
                                    className={cn(
                                        isWithdraw &&
                                            "bg-yellow-500 text-yellow-950 hover:bg-yellow-600",
                                        !isWithdraw &&
                                            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                                    )}
                                >
                                    {isDeleting
                                        ? isWithdraw
                                            ? "Withdrawing…"
                                            : "Deleting…"
                                        : isWithdraw
                                          ? "Withdraw"
                                          : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardContent>
        </Card>
    );
}

const MySentRentalRequest = () => {
    const sentRequests = useRentalRequestStore((s) => s.sentRequests);
    const isLoadingSent = useRentalRequestStore((s) => s.isLoadingSent);
    const isRefetchingSent = useRentalRequestStore((s) => s.isRefetchingSent);
    const fetchSentError = useRentalRequestStore((s) => s.fetchSentError);
    const feedback = useRentalRequestStore((s) => s.feedback);
    const fetchMySentRequests = useRentalRequestStore(
        (s) => s.fetchMySentRequests,
    );
    const clearFeedback = useRentalRequestStore((s) => s.clearFeedback);

    useEffect(() => {
        fetchMySentRequests();
    }, [fetchMySentRequests]);

    // Auto-dismiss the feedback banner after a few seconds.
    useEffect(() => {
        if (!feedback) return;
        const timer = setTimeout(() => clearFeedback(), 4000);
        return () => clearTimeout(timer);
    }, [feedback, clearFeedback]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Sent Requests</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchMySentRequests()}
                    disabled={isLoadingSent || isRefetchingSent}
                >
                    <RefreshCw
                        className={
                            isRefetchingSent ? "size-4 animate-spin" : "size-4"
                        }
                    />
                    Refresh
                </Button>
            </div>

            {feedback && (
                <p
                    className={
                        feedback.variant === "success"
                            ? "text-sm text-emerald-600"
                            : "text-sm text-destructive"
                    }
                >
                    {feedback.message}
                </p>
            )}

            {isLoadingSent && (
                <div className="space-y-4">
                    <SentRequestCardSkeleton />
                    <SentRequestCardSkeleton />
                </div>
            )}

            {!isLoadingSent && fetchSentError && (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <p className="text-sm text-destructive">{fetchSentError}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchMySentRequests()}
                    >
                        Try again
                    </Button>
                </div>
            )}

            {!isLoadingSent && !fetchSentError && sentRequests.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                    You haven&apos;t sent any rental requests yet.
                </p>
            )}

            {!isLoadingSent && !fetchSentError && sentRequests.length > 0 && (
                <div className="space-y-4">
                    {sentRequests.map((request) => (
                        <SentRequestCard key={request.id} request={request} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MySentRentalRequest;
