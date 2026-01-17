import data from "../data/cart_items.json";
import products from "../data/products.json";
import {http, HttpResponse} from "msw";
import {getFinalPrice} from "../../utils/getFinalPrice";

export const cartItemHandlers = [

    // Lấy danh sách item theo cart_id
    http.get("/api/cart_items", ({request}) => {
        const url = new URL(request.url);
        const cartId = url.searchParams.get("cart_id");

        const items = data.cart_items.filter(
            i => i.cart_id === Number(cartId)
        );

        return HttpResponse.json({cart_items: items});
    }),

    http.patch("/api/cart_items/:id", async ({params, request}) => {
        const {id} = params;
        const body = (await request.json()) as { quantity: number };

        const item = data.cart_items.find(i => i.id === Number(id));
        if (!item) return new HttpResponse(null, {status: 404});

        const product = products.products.find(p => p.id === item.product_id);
        if (!product) return new HttpResponse(null, {status: 404});

        item.quantity = body.quantity;
        const result = getFinalPrice(product, body.quantity);
        item.price = result.price;
        item.updated_at = new Date().toISOString();

        return HttpResponse.json(item);
    }),

    http.post("/api/cart_items", async ({request}) => {
        const body = (await request.json()) as {
            cart_id: number;
            product_id: number;
            quantity: number;
        };

        const existed = data.cart_items.find(
            i =>
                i.cart_id === body.cart_id &&
                i.product_id === body.product_id
        );

        const product = products.products.find(
            p => p.id === body.product_id
        );
        if (!product) return new HttpResponse(null, {status: 404});

        const result = getFinalPrice(product, body.quantity);
        const finalPrice = result.price;

        if (existed) {
            existed.quantity += body.quantity;
            const result = getFinalPrice(product, existed.quantity);
            existed.price = result.price;
            existed.updated_at = new Date().toISOString();
            return HttpResponse.json(existed);
        }

        const newItem = {
            id: Date.now(),
            cart_id: body.cart_id,
            product_id: body.product_id,
            price: finalPrice,
            original_price: product.price,
            quantity: body.quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        data.cart_items.push(newItem);
        return HttpResponse.json(newItem, {status: 201});
    }),
];