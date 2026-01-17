export interface WholesalePriceRule {
    min: number;
    max: number | null;
    price: number;
}

export type ComboItemApi = {
    id: number;
    name: string;
    image: string;
    quantity: number;
};

export interface ProductApi {
    id: number;
    slug: string;
    name: string;
    type: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    status: string;
    image?: string;

    images?: {
        id: number;
        url: string;
        order: number;
        is_main?: boolean; }[];
    wholesalePrices?: WholesalePriceRule[];
    comboItems?: ComboItemApi[];
}
