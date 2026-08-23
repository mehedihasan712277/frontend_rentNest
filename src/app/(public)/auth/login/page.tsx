import type { Metadata } from "next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
    title: "Log in | RentNest",
    description: "Log in to your RentNest account",
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ registered?: string }>;
}) {
    const { registered } = await searchParams;

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Log in to your RentNest account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    {registered === "1" && (
                        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                            Account created. Log in to continue.
                        </p>
                    )}
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
