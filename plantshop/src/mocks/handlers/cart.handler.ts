import data from "../data/carts.json";
import { http, HttpResponse } from "msw";

export const cartHandlers = [
    // Lấy danh sách cart đang active (user hoặc guest)
    http.get("/plant/carts", ({ request }) => {
        // Lấy query params từ URL
        const url = new URL(request.url);
        const userId = url.searchParams.get("user_id"); // id user đã login
        const sessionId = url.searchParams.get("session_id"); // session guest
        // Lấy tất cả cart có trạng thái active
        let result = data.carts.filter(c => c.status === "active");

        // Nếu có user_id -> lọc cart của user đó
        if (userId) {
            result = result.filter(c => c.user_id === Number(userId));
        }
        // Nếu có session_id -> lọc cart của guest đó
        if (sessionId) {
            result = result.filter(c => c.session_id === sessionId);
        }
        // Trả về danh sách cart
        return HttpResponse.json({ carts: result });
    }),

    // Tạo cart mới (user hoặc guest)
    http.post("/plant/carts", async ({ request }) => {
        // Lấy body từ request
        const body = await request.json() as {
            user_id: number | null;
            session_id: string | null;
        };

        // Tạo cart cho user hoặc guest
        const newCart =
            body.user_id !== null
                ? {
                    id: Date.now(),
                    user_id: body.user_id, // cart của user
                    session_id: null,
                    status: "active",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
                : {
                    id: Date.now(),
                    user_id: null,
                    session_id: body.session_id!, // cart của guest
                    status: "active",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

        // Lưu cart mới
        data.carts.push(newCart);
        // Trả về cart vừa tạo
        return HttpResponse.json(newCart, { status: 201 });
    }),
];
