"use client";

import { api } from "@/lib/axios-client";
import { useEffect, useState } from "react";
export interface CategoryProperty {
    title: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _count: {
        properties: number;
    };
    properties: CategoryProperty[];
}

export interface GetAllCategoriesResponse {
    success: boolean;
    statusCode: number;
    count: number;
    message: string;
    data: Category[];
}

const GetCategory = () => {
    const [category, setCategory] = useState<GetAllCategoriesResponse | null>(
        null,
    );
    useEffect(() => {
        api.get("/categories").then((res) => {
            setCategory(res.data);
            console.log(res.data);
        });
    }, []);
    return <div>GetCategory {category?.data.length}</div>;
};

export default GetCategory;
