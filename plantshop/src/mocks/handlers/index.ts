import { productHandlers } from "./product.handler";
import { wishlistHandlers } from './wishlist.handler';
export const handlers = [
    ...productHandlers,
    ...wishlistHandlers,
];
