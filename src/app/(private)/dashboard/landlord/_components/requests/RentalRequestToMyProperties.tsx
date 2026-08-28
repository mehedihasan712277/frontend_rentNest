"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, X } from "lucide-react";

import {
    ReceivedRentalRequest,
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

function ReceivedRequestCardSkeleton() {
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

type PendingAction = "approve" | "reject" | null;

interface ReceivedRequestCardProps {
    request: ReceivedRentalRequest;
}

function ReceivedRequestCard({ request }: ReceivedRequestCardProps) {
    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    // Tracks which of the two actions is the one currently in flight for
    // this card, so the correct button shows its own loading state.
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    const updatingStatusId = useRentalRequestStore((s) => s.updatingStatusId);
    const updateRentalRequestStatus = useRentalRequestStore(
        (s) => s.updateRentalRequestStatus,
    );

    const isUpdating = updatingStatusId === request.id;
    const isApproving = isUpdating && pendingAction === "approve";
    const isRejecting = isUpdating && pendingAction === "reject";
    const isPending = request.status === "PENDING";

    const handleApprove = async () => {
        setPendingAction("approve");
        const ok = await updateRentalRequestStatus(request.id, "APPROVED");
        if (ok) setApproveOpen(false);
    };

    const handleReject = async () => {
        setPendingAction("reject");
        const ok = await updateRentalRequestStatus(request.id, "REJECTED");
        if (ok) setRejectOpen(false);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <h3 className="font-semibold leading-none">
                        {request.property.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        From: {request.tenant.name}
                    </p>
                </div>
                <Badge variant="secondary">{request.status}</Badge>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    {request.message}
                </p>

                <p className="text-sm text-muted-foreground">
                    Sent {new Date(request.createdAt).toLocaleDateString()}
                </p>

                {isPending && (
                    <div className="flex gap-2">
                        <AlertDialog
                            open={approveOpen}
                            onOpenChange={setApproveOpen}
                        >
                            <AlertDialogTrigger
                                className={cn(
                                    buttonVariants({
                                        size: "sm",
                                    }),
                                    "disabled:pointer-events-none disabled:opacity-50",
                                )}
                                disabled={isUpdating}
                            >
                                {isApproving ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Approving…
                                    </>
                                ) : (
                                    <>
                                        <Check className="size-4" />
                                        Approve
                                    </>
                                )}
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Approve this rental request?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will approve {request.tenant.name}
                                        &apos;s request for &ldquo;
                                        {request.property.title}&rdquo;.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isUpdating}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleApprove();
                                        }}
                                        disabled={isUpdating}
                                    >
                                        {isApproving ? "Approving…" : "Approve"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog
                            open={rejectOpen}
                            onOpenChange={setRejectOpen}
                        >
                            <AlertDialogTrigger
                                className={cn(
                                    buttonVariants({
                                        variant: "destructive",
                                        size: "sm",
                                    }),
                                    "disabled:pointer-events-none disabled:opacity-50",
                                )}
                                disabled={isUpdating}
                            >
                                {isRejecting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Cancelling…
                                    </>
                                ) : (
                                    <>
                                        <X className="size-4" />
                                        Cancel
                                    </>
                                )}
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Reject this rental request?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will reject {request.tenant.name}
                                        &apos;s request for &ldquo;
                                        {request.property.title}&rdquo;. This
                                        can&apos;t be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isUpdating}>
                                        Back
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleReject();
                                        }}
                                        disabled={isUpdating}
                                    >
                                        {isRejecting ? "Cancelling…" : "Reject"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

const RentalRequestToMyProperties = () => {
    const receivedRequests = useRentalRequestStore((s) => s.receivedRequests);
    const isLoadingReceived = useRentalRequestStore((s) => s.isLoadingReceived);
    const isRefetchingReceived = useRentalRequestStore(
        (s) => s.isRefetchingReceived,
    );
    const fetchReceivedError = useRentalRequestStore(
        (s) => s.fetchReceivedError,
    );
    const feedback = useRentalRequestStore((s) => s.feedback);
    const fetchRequestsToMe = useRentalRequestStore((s) => s.fetchRequestsToMe);
    const clearFeedback = useRentalRequestStore((s) => s.clearFeedback);

    useEffect(() => {
        fetchRequestsToMe();
    }, [fetchRequestsToMe]);

    // Auto-dismiss the approve/reject feedback banner after a few seconds.
    useEffect(() => {
        if (!feedback) return;
        const timer = setTimeout(() => clearFeedback(), 4000);
        return () => clearTimeout(timer);
    }, [feedback, clearFeedback]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Requests to My Properties
                </h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchRequestsToMe()}
                    disabled={isLoadingReceived || isRefetchingReceived}
                >
                    <RefreshCw
                        className={
                            isRefetchingReceived
                                ? "size-4 animate-spin"
                                : "size-4"
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

            {isLoadingReceived && (
                <div className="space-y-4">
                    <ReceivedRequestCardSkeleton />
                    <ReceivedRequestCardSkeleton />
                </div>
            )}

            {!isLoadingReceived && fetchReceivedError && (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <p className="text-sm text-destructive">
                        {fetchReceivedError}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchRequestsToMe()}
                    >
                        Try again
                    </Button>
                </div>
            )}

            {!isLoadingReceived &&
                !fetchReceivedError &&
                receivedRequests.length === 0 && (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                        No pending requests on your properties right now.
                    </p>
                )}

            {!isLoadingReceived &&
                !fetchReceivedError &&
                receivedRequests.length > 0 && (
                    <div className="space-y-4">
                        {receivedRequests.map((request) => (
                            <ReceivedRequestCard
                                key={request.id}
                                request={request}
                            />
                        ))}
                    </div>
                )}
        </div>
    );
};

export default RentalRequestToMyProperties;
