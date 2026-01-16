import data from "../data/carts.json";
import {http, HttpResponse} from "msw";
import { getUserFromRequest } from "../../mocks/utils";

export const cartHandlers = [
    // Lấy danh sách cart đang active (user hoặc guest)
    http.get("/plant/carts", ({ request }) => {
        const user = getUserFromRequest(request);

        const url = new URL(request.url);
        const sessionId = url.searchParams.get("session_id");

        let result = data.carts.filter(c => c.status === "active");

        if (user) {
            // User đã đăng nhập → lấy cart theo user.id
            result = result.filter(c => c.user_id === user.id);
        } else if (sessionId) {
            // Guest → lấy cart theo session
            result = result.filter(c => c.session_id === sessionId);
        }

        return HttpResponse.json({ carts: result });
    }),

    // Tạo cart mới (user hoặc guest)
    http.post("/plant/carts", async ({request}) => {
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

        data.carts.push(newCart);
        return HttpResponse.json(newCart, {status: 201});
    }),
];
