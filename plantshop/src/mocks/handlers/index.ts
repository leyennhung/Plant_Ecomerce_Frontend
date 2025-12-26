import { productHandlers } from "./product.handler";
import {categoryHandlers} from "./category.handler";
import { wishlistHandlers } from "./wishlist.handler";
export const handlers = [
    ...productHandlers,
    ...categoryHandlers,
    ...wishlistHandlers
];
