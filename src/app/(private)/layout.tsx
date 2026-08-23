import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-current-user";

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    // Should never trigger in practice — proxy.ts already redirected —
    // but guards against a misconfigured matcher or a direct RSC fetch.
    if (!user) {
        redirect("/auth/login");
    }

    return <>{children}</>;
}
