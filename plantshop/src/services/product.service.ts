import { api } from "./api";
import type { Product } from "../types/product.type";

//Khai báo
export const productService = { // tự đăt để gom các hàm liên quan đến API
    // Đặt hàm getAll() trả về một (kiểu) Promise bên trong là 1 mảng Product
    getAll(): Promise<Product[]> {
        // Sau đó trả về res(response tự đặt) từ server
        return api.get("/products").then(res => res.data);
        // data là thuộc tính có sẵn của axios response
        // Chứa dữ liệu backend trả về
    }
};
