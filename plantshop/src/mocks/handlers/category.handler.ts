import data from "../data/category.json";
import { http, HttpResponse } from "msw"; //hàm có sẵn của thư viện MSW

export const categoryHandlers = [
    //GET /plant/catelogies
    http.get("/api/categories", () => {
        return HttpResponse.json({ categories: data.categories });
    }),
];