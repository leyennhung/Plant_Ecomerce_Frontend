import { productHandlers } from "./product.handler";
import {categoryHandlers} from "./category.handler";

export const handlers = [
    ...productHandlers,
    ...categoryHandlers
];
