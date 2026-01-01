import data from "../data/carts.json";
import {http, HttpResponse} from "msw";

export const cartHandlers = [
    // lọc theo user / guest
    http.get("/plant/carts", ({request}) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get("user_id");
        const sessionId = url.searchParams.get("session_id");

        let result = data.carts.filter(c => c.status === "active");

        if (userId) {
            result = result.filter(c => c.user_id === Number(userId));
        }

        if (sessionId) {
            result = result.filter(c => c.session_id === sessionId);
        }

        return HttpResponse.json({carts: result});
    })
];
