export default function Loading() {
    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto w-full max-w-7xl animate-pulse">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-7 w-48 rounded-md bg-muted" />
                        <div className="h-4 w-72 rounded-md bg-muted" />
                    </div>

                    <div className="h-10 w-32 rounded-lg bg-muted" />
                </div>

                {/* Main content */}
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-xl border border-border bg-card"
                        >
                            {/* Image / Preview */}
                            <div className="h-48 w-full bg-muted" />

                            {/* Content */}
                            <div className="space-y-4 p-5">
                                <div className="h-5 w-3/4 rounded-md bg-muted" />

                                <div className="space-y-2">
                                    <div className="h-3 w-full rounded bg-muted" />
                                    <div className="h-3 w-5/6 rounded bg-muted" />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="h-8 w-20 rounded-md bg-muted" />
                                    <div className="h-4 w-16 rounded bg-muted" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
