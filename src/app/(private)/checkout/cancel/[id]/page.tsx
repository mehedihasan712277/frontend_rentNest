import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const CancelPage = () => {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="items-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                        <CreditCard className="size-8 text-muted-foreground" />
                    </div>

                    <CardTitle className="text-2xl">
                        Payment Cancelled
                    </CardTitle>

                    <CardDescription className="max-w-sm">
                        Your payment was cancelled and no charge was made. You
                        can return to your dashboard.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="rounded-lg border bg-muted/40 p-4 text-left">
                        <p className="text-sm font-medium">
                            Payment not completed
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            No payment has been charged to your account. You can
                            continue using your dashboard.
                        </p>
                    </div>
                </CardContent>

                <CardFooter>
                    <Link href="/dashboard/tenant" className="w-full">
                        <Button className="w-full">
                            <ArrowLeft className="size-4" />
                            Go to Dashboard
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </main>
    );
};

export default CancelPage;
