import { http, HttpResponse } from "msw";
import wishlistData from "../data/wishlist.json";
import type { WishlistItem } from "../../types/wishlist.type";

const STORAGE_KEY = "wishlist_db";

const loadDB = (): WishlistItem[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : wishlistData.wishlist;
};

const saveDB = (db: WishlistItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const wishlistHandlers = [
    http.get("/api/wishlist", () => {
        const db = loadDB();
        return HttpResponse.json({ wishlist: db });
    }),
    // xóa product
    http.delete("/api/wishlist/:productId", ({ params }) => {
        const productId = Number(params.productId);
        const db = loadDB().filter(
            item => item.product_id !== productId
        );

        saveDB(db);

        return HttpResponse.json({ success: true });
    }),
];
