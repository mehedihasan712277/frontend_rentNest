import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="w-full max-w-lg text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <FileQuestion className="h-8 w-8 text-muted-foreground" />
                </div>

                {/* 404 */}
                <p className="text-7xl font-bold tracking-tight text-primary sm:text-8xl">
                    404
                </p>

                <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                    Page not found
                </h1>

                <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                    Sorry, we couldn&apos;t find the page you&apos;re looking
                    for. It may have been moved, deleted, or the URL may be
                    incorrect.
                </p>

                {/* Action */}
                <a
                    href="/dashboard"
                    className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                </a>
            </div>
        </main>
    );
}
