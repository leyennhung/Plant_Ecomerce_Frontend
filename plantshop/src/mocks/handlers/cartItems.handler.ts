import data from "../data/cart_items.json";
import { http, HttpResponse } from "msw";

export const cartItemHandlers = [

    // Lấy danh sách item theo cart_id
    http.get("/plant/cart_items", ({ request }) => {
        // Lấy cart_id từ query params
        const url = new URL(request.url);
        const cartId = url.searchParams.get("cart_id");

        // Lọc các item thuộc cart đó
        const items = data.cart_items.filter(
            i => i.cart_id === Number(cartId)
        );
        // Trả về danh sách cart items
        return HttpResponse.json({ cart_items: items });
    }),

    // Cập nhật số lượng item trong cart
    http.patch("/plant/cart_items/:id", async ({ params, request }) => {
        const { id } = params;
        const body = (await request.json()) as { quantity: number };

        // Tìm cart item theo id
        const item = data.cart_items.find(i => i.id === Number(id));
        if (!item) return new HttpResponse(null, { status: 404 });

        // Cập nhật quantity
        item.quantity = body.quantity;
        // Trả về item sau khi update
        return HttpResponse.json(item);
    }),

    //  Thêm sản phẩm vào cart
    http.post("/plant/cart_items", async ({ request }) => {
        const body = await request.json() as {
            cart_id: number;
            product_id: number;
            price: number;
            quantity: number;
        };

        // Kiểm tra sản phẩm đã tồn tại trong cart chưa
        const existed = data.cart_items.find(
            i =>
                i.cart_id === body.cart_id &&
                i.product_id === body.product_id
        );

        // Nếu đã tồn tại thì cộng thêm số lượng
        if (existed) {
            existed.quantity += body.quantity;
            return HttpResponse.json(existed);
        }

        // Nếu chưa tồn tại thì tạo item mới
        const newItem = {
            id: Date.now(),
            ...body,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Lưu item mới
        data.cart_items.push(newItem);
        // Trả về item vừa tạo
        return HttpResponse.json(newItem, { status: 201 });
    }),
];
