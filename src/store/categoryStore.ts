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
