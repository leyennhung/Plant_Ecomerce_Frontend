import data from "../data/products.json";
import { http, HttpResponse } from "msw"; //hàm có sẵn của thư viện MSW

export const productHandlers = [
    //GET API
    http.get("/plant/products", () => {
        return HttpResponse.json(data.products); //Trả về response dạng JSON
    }),
    // GET /plant/new_products      => trả mảng sp moi
    http.get("/plant/new_products", () => {
        return HttpResponse.json(data.new_products);
    }),
    //GET /plant/trending_products  => trả mảng sp trend
    http.get("/plant/trending_products", () => {
        return HttpResponse.json(data.trending_products);
    }),
    // GET /plant/sale_products      => trả mảng sp khuyến mãi
    http.get("/plant/sale_products", () => {
        return HttpResponse.json(data.sale_products);
    }),
    //GET /plant/wholesale_products  => trả mảng sp giá sĩ
    http.get("/plant/wholesale_products", () => {
        return HttpResponse.json(data.wholesale_products);
    }),
    //GET /plant/supplies_products  => trả mảng sp vật tư
    http.get("/plant/supplies_products", () => {
        return HttpResponse.json(data.supplies_products);
    }),
    //GET /plant/supplies_products  => trả mảng sp combo
    http.get("/plant/combo_products", () => {
        return HttpResponse.json(data.combo_products);
    })
];
