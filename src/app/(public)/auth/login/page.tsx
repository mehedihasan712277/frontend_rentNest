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

const LoginPage = () => {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Log in to your RentNest account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
