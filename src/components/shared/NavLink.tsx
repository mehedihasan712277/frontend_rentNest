"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavLinkProps = {
    href: string;
    label: string;
    onClick?: () => void;
};

export function NavLink({ href, label, onClick }: NavLinkProps) {
    const pathname = usePathname();
    const isActive =
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "text-sm hover:text-foreground",
                isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
            )}
        >
            {label}
        </Link>
    );
}
