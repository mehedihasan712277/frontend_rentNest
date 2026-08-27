import Link from "next/link";

import { getCurrentUser } from "@/lib/get-current-user";
import { roleToDashboardPath } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./LogoutButton";
import { ModeToggle } from "./ThemeSwitcher";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
];

const Navbar = async () => {
    const user = await getCurrentUser();
    const dashboardHref = user ? roleToDashboardPath(user.role) : null;

    return (
        <div className="border-b">
            <nav className="flex items-center justify-between px-6 py-4">
                <Link href="/" className="font-semibold">
                    RentNest
                </Link>

                {/* Desktop nav links */}
                <ul className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <NavLink href={link.href} label={link.label} />
                        </li>
                    ))}
                </ul>

                {/* Desktop auth + theme */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {dashboardHref && (
                                <Link
                                    href={dashboardHref}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <LogoutButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost">
                                <Link href="/auth/login">Log in</Link>
                            </Button>
                            <Button>
                                <Link href="/auth/register">Sign up</Link>
                            </Button>
                        </div>
                    )}
                    <ModeToggle />
                </div>

                {/* Mobile: theme toggle always visible + hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <ModeToggle />
                    <MobileNav
                        navLinks={navLinks}
                        user={user}
                        dashboardHref={dashboardHref}
                    />
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
