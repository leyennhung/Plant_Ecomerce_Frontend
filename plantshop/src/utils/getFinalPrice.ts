import type { ProductApi } from "../types/product-api.type";

export function getFinalPrice(product: ProductApi, quantity: number) {
    const rules = product.wholesalePrices?.filter(w => w.min > 1);

    if (!rules || rules.length === 0) {
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
