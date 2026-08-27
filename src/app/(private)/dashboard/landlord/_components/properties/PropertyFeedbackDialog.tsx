"use client";

import { usePropertyStore } from "@/store/propertyStore";
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
 * Every create/update/delete/status-change call in the property store writes
 * its message (success or error, straight from the API's `message` field)
 * into `feedback`. This dialog is the single place that surfaces it, so it
 * only needs to be rendered once near the top of the property screen.
 */
export function PropertyFeedbackDialog() {
    const feedback = usePropertyStore((state) => state.feedback);
    const clearFeedback = usePropertyStore((state) => state.clearFeedback);

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
