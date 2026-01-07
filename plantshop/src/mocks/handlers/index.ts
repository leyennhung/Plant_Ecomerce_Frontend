import { productHandlers } from "./product.handler";
import {categoryHandlers} from "./category.handler";
import { wishlistHandlers } from "./wishlist.handler";
import { cartHandlers } from "./cart.handler";
import { cartItemHandlers } from "./cartItems.handler";
import { authHandlers } from './auth.handler';
export const handlers = [
    ...cartHandlers,
    ...cartItemHandlers,
    ...productHandlers,
    ...categoryHandlers,
    ...wishlistHandlers,
    ...authHandlers
];
