import { ShieldCheck, Clock, Wallet, Headset } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Listings",
        description:
            "Every property is verified by our team, so what you see is exactly what you get.",
    },
    {
        icon: Wallet,
        title: "No Hidden Fees",
        description:
            "Transparent pricing from the start — no surprise charges when it's time to sign.",
    },
    {
        icon: Clock,
        title: "Fast Booking",
        description:
            "Book a viewing or reserve a property in just a few clicks, any time of day.",
    },
    {
        icon: Headset,
        title: "24/7 Support",
        description:
            "Our support team is always available to help with questions before or after you move in.",
    },
];

export function WhyChooseUsSection() {
    return (
        <section className="container mx-auto px-4 py-12">
            <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Why Choose Us
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    We make finding and renting a home simple, safe, and
                    stress-free
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map(({ icon: Icon, title, description }) => (
                    <div
                        key={title}
                        className="flex flex-col items-center rounded-xl border p-6 text-center transition-colors hover:border-primary/50"
                    >
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="size-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
