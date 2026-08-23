import Link from "next/link";

import { getCurrentUser } from "@/lib/get-current-user";
import { roleToDashboardPath } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./LogoutButton";

const Navbar = async () => {
    const user = await getCurrentUser();

    return (
        <div>
            <nav className="flex items-center justify-between px-6 py-4">
                <Link href="/" className="font-semibold">
                    RentNest
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <Link
                            href={roleToDashboardPath(user.role)}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Dashboard
                        </Link>
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
            </nav>
        </div>
    );
};

export default Navbar;
