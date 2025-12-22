import data from "../data/category.json";
import { http, HttpResponse } from "msw"; //hàm có sẵn của thư viện MSW

export const categoryHandlers = [
    //GET /plant/catelogy
    http.get("/plant/category", () => {
        return HttpResponse.json({ categories: data.category });
    }),
];