"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LogoutButton } from "./LogoutButton";

type NavLink = { href: string; label: string };

type MobileNavProps = {
    navLinks: NavLink[];
    user: { role: string } | null;
    dashboardHref: string | null;
};

export function MobileNav({ navLinks, user, dashboardHref }: MobileNavProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setOpen((prev) => !prev)}
            >
                {open ? (
                    <X className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle menu</span>
            </Button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover p-4 shadow-md">
                    <ul className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                    onClick={() => setOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                        {user ? (
                            <>
                                {dashboardHref && (
                                    <Link
                                        href={dashboardHref}
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                        onClick={() => setOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <LogoutButton />
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => setOpen(false)}
                                >
                                    <Link href="/auth/login">Log in</Link>
                                </Button>
                                <Button onClick={() => setOpen(false)}>
                                    <Link href="/auth/register">Sign up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
