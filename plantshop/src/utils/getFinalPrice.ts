import type {ProductApi} from "../types/product-api.type.ts";

export function getFinalPrice(product: ProductApi, quantity: number) {
    const rules = product.wholesalePrices;

    if (!rules?.length) {
        return {
            price: product.salePrice ?? product.price,
            isWholesale: false,
            wholesaleMin: undefined,
        };
    }

    const rule = rules.find(
        w => quantity >= w.min && (w.max === null || quantity <= w.max)
    );

    if (rule) {
        return {
            price: rule.price,
            isWholesale: true,
            wholesaleMin: undefined,
        };
    }

    const minRule = rules.reduce((a, b) => (a.min < b.min ? a : b));

    return {
        price: product.salePrice ?? product.price,
        isWholesale: false,
        wholesaleMin: minRule.min,
    };
}
