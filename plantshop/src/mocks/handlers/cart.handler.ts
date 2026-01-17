import data from "../data/carts.json";
import {http, HttpResponse} from "msw";
import { getUserFromRequest } from "../../mocks/utils";

export const cartHandlers = [
    // Lấy danh sách cart đang active (user hoặc guest)
    http.get("/api/carts", ({ request }) => {

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
    http.post("/api/carts", async ({request}) => {
        const user = getUserFromRequest(request);
        const body = (await request.json()) as {
            session_id: string | null;
        };

        if (user) {
            const newCart = {
                id: Date.now(),
                user_id: Number(user.id),
                session_id: null,
                status: "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            data.carts.push(newCart);
            return HttpResponse.json(newCart, {status: 201});
        }

        // Guest
        const newCart = {
            id: Date.now(),
            user_id: null,
            session_id: body.session_id!, // đảm bảo có session
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Lưu cart mới
        data.carts.push(newCart);
        return HttpResponse.json(newCart, {status: 201});
    }),
];
