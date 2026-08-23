"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function LogoutSubmitButton({ className }: { className?: string }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            variant="outline"
            className={cn("gap-2", className)}
            disabled={pending}
        >
            <LogOut className="size-4" />
            {pending ? "Logging out..." : "Log out"}
        </Button>
    );
}

export function LogoutButton({ className }: { className?: string }) {
    return (
        <form action={logoutAction}>
            <LogoutSubmitButton className={className} />
        </form>
    );
}
