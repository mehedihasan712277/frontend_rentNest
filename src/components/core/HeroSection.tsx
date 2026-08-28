import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative py-10 px-4 sm:px-6">
            {/* Decorative Blur */}
            <div className="pointer-events-none absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] hidden md:block" />

            <div className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center text-center">
                {/* Badge */}

                <div className="mb-8 rounded-full border bg-muted/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                    Trusted by landlords & tenants
                </div>

                {/* Heading */}

                <h1 className="max-w-5xl font-heading text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
                    Find Your Next
                    <br />
                    <span className="bg-linear-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                        Rental Home
                    </span>
                    <br />
                    Without the Stress.
                </h1>

                {/* Description */}

                <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                    Browse verified apartments, family homes and commercial
                    properties. Fast search, transparent pricing and trusted
                    landlords.
                </p>

                {/* CTA */}

                <div className="mt-10 flex flex-col justify-center items-center gap-4 sm:flex-row w-full xs:w-fit">
                    <Link href="/auth/login">
                        <Button>Get Started</Button>
                    </Link>
                </div>

                {/* Stats */}

                <div className="mt-24 grid w-full max-w-4xl grid-cols-2 border-t pt-8 md:grid-cols-4">
                    <Stat number="2K+" label="Properties" />

                    <Stat number="300+" label="Landlords" />

                    <Stat number="1.5K+" label="Tenants" />

                    <Stat number="99%" label="Verified Listings" />
                </div>
            </div>
        </section>
    );
}

function Stat({ number, label }: { number: string; label: string }) {
    return (
        <div>
            <h3 className="text-3xl font-bold ">{number}</h3>
            <p className="mt-1 text-sm ">{label}</p>
        </div>
    );
}
