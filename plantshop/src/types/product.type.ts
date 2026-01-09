export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    stock: number;
    imageUrl: string;
    image: string;
    category?: string;
}