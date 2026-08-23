"use client";

import { useAmenityStore } from "@/store/amenityStore";
import { buttonVariants } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/**
 * Every create/delete call in the amenity store writes its message
 * (success or error, straight from the API's `message` field) into
 * `feedback`. This dialog is the single place that surfaces it, so it only
 * needs to be rendered once near the top of the amenity screen.
 */
export function AmenityFeedbackDialog() {
    const feedback = useAmenityStore((state) => state.feedback);
    const clearFeedback = useAmenityStore((state) => state.clearFeedback);

    return (
        <AlertDialog
            open={feedback !== null}
            onOpenChange={(open) => {
                if (!open) clearFeedback();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {feedback?.variant === "error"
                            ? "Something went wrong"
                            : "Success"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {feedback?.message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        className={cn(buttonVariants())}
                        onClick={clearFeedback}
                    >
                        Close
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
