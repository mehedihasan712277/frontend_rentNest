"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";

import {
    AdminRentalRequest,
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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const statusVariant: Record<
    AdminRentalRequest["status"],
    "default" | "secondary" | "destructive" | "outline"
> = {
    PENDING: "secondary",
    APPROVED: "default",
    REJECTED: "destructive",
    COMPLETED: "default",
    DELETED: "outline",
};

function AdminRequestCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
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

interface AdminRequestCardProps {
    request: AdminRentalRequest;
    onDeleted: () => void;
}

function AdminRequestCard({ request, onDeleted }: AdminRequestCardProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const adminDeletingId = useRentalRequestStore((s) => s.adminDeletingId);
    const adminDeleteRequest = useRentalRequestStore(
        (s) => s.adminDeleteRequest,
    );

    const isDeleting = adminDeletingId === request.id;

    const handleConfirmDelete = async () => {
        setConfirmOpen(false);
        await adminDeleteRequest(request.id);
        onDeleted();
    };

    return (
        <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="font-semibold leading-none">
                        {request.property.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Tenant: {request.tenant.name} · Landlord:{" "}
                        {request.property.landlord.name}
                    </p>
                </div>
                <Badge
                    variant={statusVariant[request.status]}
                    className="w-fit"
                >
                    {request.status}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    {request.message}
                </p>

                <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                    <span>${request.property.price.toLocaleString()}/mo</span>
                    <span>{request.property.area} sqft</span>
                    <span>
                        Sent {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                        Updated{" "}
                        {new Date(request.updatedAt).toLocaleDateString()}
                    </span>
                </div>

                {(request.stripeSessionId || request.stripeSubscriptionId) && (
                    <div className="space-y-1 break-all text-xs text-muted-foreground">
                        {request.stripeSessionId && (
                            <p>Stripe session: {request.stripeSessionId}</p>
                        )}
                        {request.stripeSubscriptionId && (
                            <p>
                                Stripe subscription:{" "}
                                {request.stripeSubscriptionId}
                            </p>
                        )}
                    </div>
                )}

                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogTrigger
                        className={cn(
                            buttonVariants({
                                variant: "destructive",
                                size: "sm",
                            }),
                            "disabled:pointer-events-none disabled:opacity-50",
                        )}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-4" />
                                Delete
                            </>
                        )}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete this rental request?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the request from{" "}
                                {request.tenant.name} for &ldquo;
                                {request.property.title}&rdquo;. This can&apos;t
                                be undone.
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
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}

const AllRentalRequest = () => {
    const [resultDialogOpen, setResultDialogOpen] = useState(false);

    const allRequests = useRentalRequestStore((s) => s.allRequests);
    const isLoadingAll = useRentalRequestStore((s) => s.isLoadingAll);
    const isRefetchingAll = useRentalRequestStore((s) => s.isRefetchingAll);
    const fetchAllError = useRentalRequestStore((s) => s.fetchAllError);
    const feedback = useRentalRequestStore((s) => s.feedback);
    const fetchAllRentalRequests = useRentalRequestStore(
        (s) => s.fetchAllRentalRequests,
    );
    const clearFeedback = useRentalRequestStore((s) => s.clearFeedback);

    useEffect(() => {
        fetchAllRentalRequests();
    }, [fetchAllRentalRequests]);

    const handleCloseResultDialog = () => {
        setResultDialogOpen(false);
        clearFeedback();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold">All Rental Requests</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAllRentalRequests()}
                    disabled={isLoadingAll || isRefetchingAll}
                    className="w-fit"
                >
                    <RefreshCw
                        className={
                            isRefetchingAll ? "size-4 animate-spin" : "size-4"
                        }
                    />
                    Refresh
                </Button>
            </div>

            {isLoadingAll && (
                <div className="space-y-4">
                    <AdminRequestCardSkeleton />
                    <AdminRequestCardSkeleton />
                </div>
            )}

            {!isLoadingAll && fetchAllError && (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <p className="text-sm text-destructive">{fetchAllError}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAllRentalRequests()}
                    >
                        Try again
                    </Button>
                </div>
            )}

            {!isLoadingAll && !fetchAllError && allRequests.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                    No rental requests found.
                </p>
            )}

            {!isLoadingAll && !fetchAllError && allRequests.length > 0 && (
                <div className="space-y-4">
                    {allRequests.map((request) => (
                        <AdminRequestCard
                            key={request.id}
                            request={request}
                            onDeleted={() => setResultDialogOpen(true)}
                        />
                    ))}
                </div>
            )}

            <Dialog
                open={resultDialogOpen && !!feedback}
                onOpenChange={(next) => {
                    if (!next) handleCloseResultDialog();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {feedback?.variant === "success"
                                ? "Request deleted"
                                : "Delete failed"}
                        </DialogTitle>
                    </DialogHeader>
                    <p
                        className={
                            feedback?.variant === "success"
                                ? "text-sm text-emerald-600"
                                : "text-sm text-destructive"
                        }
                    >
                        {feedback?.message}
                    </p>
                    <DialogFooter>
                        <Button onClick={handleCloseResultDialog}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AllRentalRequest;
