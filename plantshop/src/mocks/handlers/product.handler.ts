import data from "../data/products.json";
import { http, HttpResponse } from "msw"; //hàm có sẵn của thư viện MSW

export const productHandlers = [
    //GET API
    http.get("/api/products", () => {
        return HttpResponse.json(data.products); //Trả về response dạng JSON
    })
];
