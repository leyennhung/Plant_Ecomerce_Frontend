import type { Order } from "../types/order.type";
import { nanoid } from "nanoid";

export const saveOrder = (order: Omit<Order, "id">) => {
    const orders: Order[] = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    const newOrder: Order = {
        ...order,
        id: nanoid(),
    };

    localStorage.setItem(
        "orders",
        JSON.stringify([newOrder, ...orders])
    );
};

