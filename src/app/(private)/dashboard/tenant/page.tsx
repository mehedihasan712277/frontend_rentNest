"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { UserProfileCard } from "@/components/shared/UserProfileCard";
import MySentRentalRequest from "./_components/my-sent-rental-request/MySentRentalRequest";
import MyRentals from "./_components/myrentals/MyRentals";
import MyPayment from "./_components/payment/MyPayment";

// 👉 Add new tabs here — nothing else in the component needs to change
const tabs = [
    {
        id: "profile",
        label: "Profile",
        component: <UserProfileCard></UserProfileCard>,
    },
    {
        id: "requests",
        label: "Requests",
        component: <MySentRentalRequest></MySentRentalRequest>,
    },
    {
        id: "rentals",
        label: "Rentals",
        component: <MyRentals></MyRentals>,
    },
    {
        id: "payments",
        label: "Payment",
        component: <MyPayment></MyPayment>,
    },
];

const TenantDashboardPage = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <div className="p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Tenant Dashboard</h1>

                    {/* Mobile: Sheet trigger for navigating tabs */}
                    <div className="md:hidden">
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                        size: "icon",
                                    }),
                                )}
                            >
                                <Menu className="h-5 w-5" />
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64">
                                <SheetHeader>
                                    <SheetTitle>Sections</SheetTitle>
                                </SheetHeader>
                                <nav className="mt-4 flex flex-col gap-2 p-4">
                                    {tabs.map((tab) => (
                                        <Button
                                            key={tab.id}
                                            variant={
                                                activeTab === tab.id
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className="justify-start"
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setSheetOpen(false);
                                            }}
                                        >
                                            {tab.label}
                                        </Button>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop: standard tab bar */}
                    <TabsList className="hidden md:flex">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.id} value={tab.id}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Content renders ONCE, shared by both nav modes */}
                {tabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id}>
                        {tab.component}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default TenantDashboardPage;
