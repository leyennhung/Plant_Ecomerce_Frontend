import { api } from "./api";
import type { Category, CategoryResponse } from "../types/category.type";

export const categoryService = {
    // Lấy all catelogy
    getAll() : Promise<Category[]> {
        return api.get<CategoryResponse>("/category").then(res => res.data.categories);
    },

    // Lấy 1 category theo id
    getById(id: number): Promise<Category | undefined> {
        return this.getAll().then(categories => categories.find(cat => cat.id === id));
    }
};
