import { api } from "./api";
import type { Product, ProductDetail } from "../types/product.type";

//Khai báo
export const productService = { // tự đăt để gom các hàm liên quan đến API
    // Đặt hàm getAll() trả về một (kiểu) Promise bên trong là 1 mảng Product
    getAll(): Promise<Product[]> {
        // Sau đó trả về res(response tự đặt) từ server
        return api.get("/products").then(res => res.data);
        // data là thuộc tính có sẵn của axios response
        // Chứa dữ liệu backend trả về
    },
    getNewProduct(): Promise<Product[]> {
        return api.get("/new_products").then(res => res.data);
    },
    getTrendingProducts(): Promise<Product[]> {
        return api.get("/trending_products").then(res => res.data);
    },
    getSaleProducts(): Promise<Product[]> {
        return api.get("/sale_products").then(res => res.data);
    },
    getComboProducts(): Promise<Product[]> {
        return api.get("/combo_products").then(res => res.data);
    },
    getWholesaleProducts(): Promise<Product[]> {
        return api.get("/wholesale_products").then(res => res.data);
    },
    getSuppliesProducts(): Promise<Product[]> {
        return api.get("/supplies_products").then(res => res.data);
    },
    // getProductDetail(id: number): Promise<ProductDetail> {
    //     return api.get(`/products/${id}`).then(res => res.data);
    // },
    getProductDetailSlug(slug: string) : Promise<ProductDetail> {
        return api.get(`/products/${slug}`).then(res => res.data);
    },
    getRelatedProducts(slug: string): Promise<ProductDetail[]> {
        return api.get(`/products/${slug}/related`).then(res => res.data);
    },
    getSuggestSupplies(slug: string): Promise<ProductDetail[]> {
        return api.get(`/products/${slug}/accessories`).then(res => res.data);
    },
    // getSearchProducts(query: string): Promise<ProductDetail[]> {
    //     return api.get(`/products/${query}`).then(res => res.data);
    // },
//     Tìm kiếm
    getSearchProducts(query: string) {
        return api.get("/products", {params: { search: query }}).then(res => res.data);
    },

    getByCategorySlug(slug: string, attrId?: number): Promise<Product[]> {
        return api.get(`/products/category/${slug}`, {
                params: attrId ? { attrId } : {},
            })
            .then(res => res.data);
    },

};
