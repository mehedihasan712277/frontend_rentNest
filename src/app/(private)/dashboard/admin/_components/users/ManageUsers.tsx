"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Loader2, RefreshCw } from "lucide-react";
import {
    UserProfile,
    UserStatus,
    useUserProfileStore,
} from "@/store/userStore";

const STATUS_OPTIONS: UserStatus[] = ["ACTIVE", "BLOCKED", "DELETED"];

const statusBadgeVariant = (status: UserStatus) => {
    switch (status) {
        case "ACTIVE":
            return "default";
        case "BLOCKED":
            return "secondary";
        case "DELETED":
            return "destructive";
    }
};

interface PendingChange {
    id: string;
    name: string;
    currentStatus: UserStatus;
    newStatus: UserStatus;
}

interface ResultDialog {
    type: "success" | "error";
    message: string;
}

const ManageUsers = () => {
    const {
        allUsers,
        allUsersCount,
        isLoadingAllUsers,
        allUsersError,
        fetchAllUsers,
        isUpdatingUserStatus,
        updateUserStatus,
    } = useUserProfileStore();

    const [pendingChange, setPendingChange] = useState<PendingChange | null>(
        null,
    );
    const [resultDialog, setResultDialog] = useState<ResultDialog | null>(null);

    useEffect(() => {
        fetchAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStatusSelect = (user: UserProfile, newStatus: UserStatus) => {
        if (newStatus === user.status) return;
        setPendingChange({
            id: user.id,
            name: user.name,
            currentStatus: user.status,
            newStatus,
        });
    };

    const handleConfirmChange = async () => {
        if (!pendingChange) return;

        const { id, name, newStatus } = pendingChange;
        const success = await updateUserStatus({ id, status: newStatus });

        setPendingChange(null);

        if (success) {
            await fetchAllUsers();
            setResultDialog({
                type: "success",
                message: `${name}'s status was updated to ${newStatus}.`,
            });
        } else {
            const errMessage =
                useUserProfileStore.getState().updateUserStatusError ??
                "Something went wrong while updating the status.";
            setResultDialog({ type: "error", message: errMessage });
        }
    };

    const handleRefresh = () => {
        fetchAllUsers();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Manage Users</h2>
                    <p className="text-sm text-muted-foreground">
                        {allUsersCount} user{allUsersCount === 1 ? "" : "s"}{" "}
                        total
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoadingAllUsers}
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                            isLoadingAllUsers ? "animate-spin" : ""
                        }`}
                    />
                    Refresh
                </Button>
            </div>

            {allUsersError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {allUsersError}
                </div>
            )}

            <div className="rounded-md border">
                {/* Header row — only visible on md+ where columns line up */}
                <div className="hidden border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1fr]">
                    <span>User</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span className="text-right">Properties</span>
                    <span className="text-right">Requests</span>
                    <span className="text-right">Payments</span>
                </div>

                <div className="divide-y">
                    {isLoadingAllUsers && allUsers.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-4 py-3">
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))
                    ) : allUsers.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No users found.
                        </div>
                    ) : (
                        allUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-col gap-3 px-4 py-3 md:grid md:grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1fr] md:items-center md:gap-2"
                            >
                                {/* User */}
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {user.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>

                                {/* Role */}
                                <div className="flex items-center gap-2 md:block">
                                    <span className="text-xs text-muted-foreground md:hidden">
                                        Role:
                                    </span>
                                    <Badge variant="outline">{user.role}</Badge>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={statusBadgeVariant(
                                            user.status,
                                        )}
                                    >
                                        {user.status}
                                    </Badge>
                                    <Select
                                        value={user.status}
                                        onValueChange={(value) =>
                                            handleStatusSelect(
                                                user,
                                                value as UserStatus,
                                            )
                                        }
                                        disabled={
                                            isUpdatingUserStatus &&
                                            pendingChange?.id === user.id
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-32.5">
                                            <SelectValue placeholder="Change status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((status) => (
                                                <SelectItem
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Counts — inline stats on mobile, right-aligned columns on md+ */}
                                <div className="flex items-center justify-between text-sm md:block md:text-right">
                                    <span className="text-muted-foreground md:hidden">
                                        Properties
                                    </span>
                                    <span>{user.properties?.length ?? 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm md:block md:text-right">
                                    <span className="text-muted-foreground md:hidden">
                                        Requests
                                    </span>
                                    <span>
                                        {user.rentalRequests?.length ?? 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm md:block md:text-right">
                                    <span className="text-muted-foreground md:hidden">
                                        Payments
                                    </span>
                                    <span>{user.payments?.length ?? 0}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Confirmation dialog before updating status */}
            <AlertDialog
                open={pendingChange !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingChange(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change user status?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingChange && (
                                <>
                                    You&apos;re about to change{" "}
                                    <span className="font-medium">
                                        {pendingChange.name}
                                    </span>
                                    &apos;s status from{" "}
                                    <span className="font-medium">
                                        {pendingChange.currentStatus}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {pendingChange.newStatus}
                                    </span>
                                    . This action can be reverted later, but it
                                    will take effect immediately.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdatingUserStatus}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmChange();
                            }}
                            disabled={isUpdatingUserStatus}
                        >
                            {isUpdatingUserStatus && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Confirm
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

export default ManageUsers;
