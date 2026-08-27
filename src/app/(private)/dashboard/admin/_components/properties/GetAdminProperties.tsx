"use client";

import { useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import { usePropertyStore } from "@/store/propertyStore";
import { AdminPropertyList } from "./AdminPropertyList";
import { Button } from "@/components/ui/button";
import { AdminPropertyFilters } from "./AdminPropertyFilter";

const GetAdminProperties = () => {
    const fetchAdminProperties = usePropertyStore(
        (state) => state.fetchAdminProperties,
    );
    const isRefetching = usePropertyStore(
        (state) => state.isRefetchingAdminProperties,
    );
    const totalProperties = usePropertyStore(
        (state) => state.adminProperties.length,
    );

    useEffect(() => {
        fetchAdminProperties();
    }, [fetchAdminProperties]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">
                        All properties ({totalProperties})
                    </h2>
                    {isRefetching && (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    )}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isRefetching}
                    onClick={() => fetchAdminProperties()}
                >
                    <RefreshCw
                        className={
                            isRefetching ? "size-4 animate-spin" : "size-4"
                        }
                    />
                    Refresh
                </Button>
            </div>

            <AdminPropertyFilters />

            <AdminPropertyList />
        </div>
    );
};

export default GetAdminProperties;
