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
import ManageProperty from "./_components/properties/ManageProperty";
import ManageAmenity from "./_components/amenity/ManageAmenity";
import { UserProfileCard } from "@/components/shared/UserProfileCard";
import RentalRequestToMyProperties from "./_components/requests/RentalRequestToMyProperties";
import MyRentedProperty from "./_components/rented-property/MyRentedProperty";
import PaymentOnMyProperty from "./_components/payment/PaymentOnMyProperty";
import ReviewsToMyproperty from "./_components/review/ReviewsToMyproperty";

// 👉 Add new tabs here — nothing else in the component needs to change
const tabs = [
    {
        id: "property",
        label: "Property",
        component: <ManageProperty></ManageProperty>,
    },
    {
        id: "requests",
        label: "Requests",
        component: <RentalRequestToMyProperties></RentalRequestToMyProperties>,
    },
    {
        id: "amenity",
        label: "Amenity",
        component: <ManageAmenity></ManageAmenity>,
    },
    {
        id: "profile",
        label: "Profile",
        component: <UserProfileCard></UserProfileCard>,
    },
    {
        id: "rentedproperty",
        label: "Rents",
        component: <MyRentedProperty></MyRentedProperty>,
    },
    {
        id: "payments",
        label: "Payments",
        component: <PaymentOnMyProperty></PaymentOnMyProperty>,
    },
    {
        id: "reviews",
        label: "Reviews",
        component: <ReviewsToMyproperty></ReviewsToMyproperty>,
    },
];

const LandLordDashboardPage = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <div className="p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Landlord Dashboard</h1>

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

export default LandLordDashboardPage;
