"use client";

import { useParams } from "next/navigation";

const PropertyDetailsPage = () => {
    const params = useParams<{ id: string }>();

    const { id } = params;

    return <div>PropertyDetailsPage {id}</div>;
};

export default PropertyDetailsPage;
