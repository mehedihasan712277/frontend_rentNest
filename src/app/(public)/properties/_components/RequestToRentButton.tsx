"use client";

import { useState } from "react";

import { useRentalRequestStore } from "@/store/rentalRequestStore";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RequestToRentButtonProps {
    propertyId: string;
}

/**
 * The only interactive piece of the property details page: opens a small
 * dialog to collect a message, then fires the create-rental-request call.
 * Lives in a client component so the parent page can stay a server component.
 */
export function RequestToRentButton({ propertyId }: RequestToRentButtonProps) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const isCreating = useRentalRequestStore((s) => s.isCreating);
    const feedback = useRentalRequestStore((s) => s.feedback);
    const createRentalRequest = useRentalRequestStore(
        (s) => s.createRentalRequest,
    );
    const clearFeedback = useRentalRequestStore((s) => s.clearFeedback);

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) {
            clearFeedback();
            setMessage("");
        }
    };

    const handleSubmit = async () => {
        const ok = await createRentalRequest({ propertyId, message });
        if (ok) {
            setOpen(false);
            setMessage("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger className={cn(buttonVariants(), "mt-6 w-full")}>
                Request to rent
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request to rent this property</DialogTitle>
                </DialogHeader>

                <Textarea
                    placeholder="Say a few words to the landlord…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                />

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

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isCreating || message.trim().length === 0}
                    >
                        {isCreating ? "Sending…" : "Send request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
