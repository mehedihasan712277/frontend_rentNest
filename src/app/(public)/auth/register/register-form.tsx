"use client";

import { useActionState } from "react";
import Link from "next/link";

import { registerAction, type RegisterState } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const initialState: RegisterState = {};

const ROLE_OPTIONS = [
    { value: "TENANT", label: "Tenant — I'm looking for a place to rent" },
    { value: "LANDLORD", label: "Landlord — I'm listing a property" },
] as const;

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(
        registerAction,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-5" noValidate>
            {state?.error && (
                <p
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                    {state.error}
                </p>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    aria-invalid={!!state?.fieldErrors?.name}
                    required
                />
                {state?.fieldErrors?.name && (
                    <p className="text-sm text-destructive">
                        {state.fieldErrors.name}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!state?.fieldErrors?.email}
                    required
                />
                {state?.fieldErrors?.email && (
                    <p className="text-sm text-destructive">
                        {state.fieldErrors.email}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                    id="password"
                    name="password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    aria-invalid={!!state?.fieldErrors?.password}
                    required
                />
                {state?.fieldErrors?.password && (
                    <p className="text-sm text-destructive">
                        {state.fieldErrors.password}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select name="role" items={ROLE_OPTIONS}>
                    <SelectTrigger
                        id="role"
                        aria-invalid={!!state?.fieldErrors?.role}
                    >
                        <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                        {ROLE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state?.fieldErrors?.role && (
                    <p className="text-sm text-destructive">
                        {state.fieldErrors.role}
                    </p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/auth/login"
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    Log in
                </Link>
            </p>
        </form>
    );
}
