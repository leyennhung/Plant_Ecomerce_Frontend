import { productHandlers } from "./product.handler";
import {categoryHandlers} from "./category.handler";
import {reviewHandlers} from "./review.handler.ts";

export const handlers = [
    ...productHandlers,
    ...categoryHandlers,
    ...reviewHandlers
];
