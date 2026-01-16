import datapro from "../data/product_sub.json";
import data from "../data/products.json";
import { http, HttpResponse } from "msw"; //hàm có sẵn của thư viện MSW
import { normalize } from "../../utils/normalize";

export const productHandlers = [
    //GET API
    // http.get("/api/products", () => {
    //     return HttpResponse.json(data.products); //Trả về response dạng JSON
    // }),
    // GET /plant/new_products      => trả mảng sp moi
    http.get("/api/new_products", () => {
        return HttpResponse.json(datapro.new_products);
    }),
    //GET /plant/trending_products  => trả mảng sp trend
    http.get("/api/trending_products", () => {
        return HttpResponse.json(datapro.trending_products);
    }),
    // GET /plant/sale_products      => trả mảng sp khuyến mãi
    http.get("/api/sale_products", () => {
        return HttpResponse.json(datapro.sale_products);
    }),
    //GET /plant/wholesale_products  => trả mảng sp giá sĩ
    http.get("/api/wholesale_products", () => {
        return HttpResponse.json(datapro.wholesale_products);
    }),
    //GET /plant/supplies_products  => trả mảng sp vật tư
    http.get("/api/supplies_products", () => {
        return HttpResponse.json(datapro.supplies_products);
    }),
    //GET /plant/supplies_products  => trả mảng sp combo
    http.get("/api/combo_products", () => {
        return HttpResponse.json(datapro.combo_products);
    }),
    // http.get("/api/products/:id", (req) => {
    //     const id = Number(req.params.id);
    //     const product = datapro.products.find(p => p.id === id);
    //     if (!product) {
    //         return HttpResponse.json(
    //             { message: "Product not found" },
    //             { status: 404 }
    //         );
    //     }
    //     return HttpResponse.json(product);
    // })
    http.get("/api/products/:slug", ({ params }) => {
        const slug = params.slug as string;
        const product = data.products.find(
            p => p.slug === slug);
        if (!product) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(product);
    }),
    // Lọc trong danh sách
    // http.get("/api/products/:slug/related", ({ params }) => {
    //     const slug = params.slug as string;
    //     const currentproduct = datapro.products.find(p => p.slug === slug);
    //     if (!currentproduct) {
    //         return new HttpResponse(null, {status: 404});
    //     }
    //     const relatedProducts = datapro.products
    //         .filter(p =>
    //             p.slug !== slug &&
    //             p.category.id === currentproduct.category.id
    //         )
    //         .slice(0, 6);
    //     return HttpResponse.json(relatedProducts);
    // }),
    // JSON Sản phâmr tương tự
    http.get("/api/products/:slug/related", () => {
        return HttpResponse.json(datapro.relate_products);
    }),
    // JSON vật tư gợi ý đi kèm
    http.get("/api/products/:slug/accessories", () => {
        return HttpResponse.json(datapro.suggest_supplies);
    }),
//     Tìm kiếm
    http.get("/api/products", ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get("search")?.toLowerCase();
        // Không có search → trả tất cả
        if (!search) {
            return HttpResponse.json(data.products);
        }
        // Có search → lọc theo tên
        const keyword = normalize(search);
        const filteredProducts = data.products.filter(p => {
        const name = normalize(p.name);
        const slug = normalize(p.slug ?? "");
        return (
            name.includes(keyword) ||
            slug.includes(keyword)
        );
    });
return HttpResponse.json(filteredProducts);
    }),
// catelogy
//     http.get("/api/products/category/:slug", ({ params }) => {
//         const slug = params.slug as string;
//
//         const filteredProducts = datapro.products.filter(
//             p => p.category?.slug === slug
//         );
//
//         return HttpResponse.json(filteredProducts);
//     }),

    http.get("/api/products/category/:slug", ({ params, request }) => {
        const slug = params.slug as string;
        const url = new URL(request.url);

        // lấy attrId từ query
        const attrIdParam = url.searchParams.get("attrId");
        const attrId = attrIdParam ? Number(attrIdParam) : null;

        let filteredProducts = data.products.filter(
            p => p.category?.slug === slug
        );

        // nếu có attrId → lọc thêm
        if (attrId) {
            filteredProducts = filteredProducts.filter(p =>
                Array.isArray(p.attributes) &&
                p.attributes.some(attr => attr.id === attrId)
            );
        }

        return HttpResponse.json(filteredProducts);
    })


];
