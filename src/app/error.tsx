"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to your error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="w-full max-w-lg text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                {/* Content */}
                <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Something went wrong
                </p>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    We couldn&apos;t load this page
                </h1>

                <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                    An unexpected error occurred while loading this page. Please
                    try again or return to the dashboard.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        onClick={() => reset()}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try again
                    </button>

                    <a
                        href="/dashboard"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go to dashboard
                    </a>
                </div>

                {/* Error ID */}
                {error.digest && (
                    <p className="mt-8 text-xs text-muted-foreground">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </main>
    );
}
