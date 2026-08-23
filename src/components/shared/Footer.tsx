import Link from "next/link";
import { Home, Mail } from "lucide-react";

const footerLinks = [
    {
        title: "Explore",
        links: [
            { label: "Browse Properties", href: "/properties" },
            { label: "How It Works", href: "/#how-it-works" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 sm:px-8 lg:flex-row lg:justify-between">
                {/* Brand */}
                <div className="max-w-xs">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <Home className="h-5 w-5" />
                        RentNest
                    </Link>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Find your next home, or list your property &mdash; rent
                        made simple.
                    </p>
                </div>

                {/* Link columns */}
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-sm font-medium">
                                {group.title}
                            </h3>
                            <ul className="mt-3 space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-muted-foreground sm:flex-row sm:px-8">
                    <p>
                        &copy; {new Date().getFullYear()} RentNest. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="mailto:contact@rentnest.com"
                            aria-label="Email"
                            className="transition-colors hover:text-foreground"
                        >
                            <Mail className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
