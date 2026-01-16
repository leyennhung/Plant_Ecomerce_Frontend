export interface ProductBase {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    salePrice?: number | null;
    type: ProductType;
}
export type ProductType =
    | 'plant'
    | 'pot'
    | 'supplies'
    | 'seed'
    | 'combo'

export interface Product extends ProductBase {
    stock: number;
    images?: string[];
    categoryId: number;
    // attributeIds: number[];
    attributes?: Attribute[];
    hasBulkPrice?: boolean;

    comboItems?: {
        productId: number;
        quantity: number;
        name?: string;
        image?: string;
    }[];
}

export interface ProductImage {
    id: number;
    url: string;
    order: number;
}
export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Attribute {
    id: number;
    name: string;
    slug: string;
    group?: string;
}

export interface WholesalePrice {
    min: number;
    max: number | null;
    price: number;
}

export interface PlantDetail {
    commonName: string;
    scientificName: string;
    difficulty: 'easy' | 'medium' | 'hard';
    light: string;
    water: string;
}

export interface ProductDimensions {
    weight: string;
    potWidth: string;
    potHeight: string;
    totalHeight: string;
    canopyWidth: string;
}

export interface ProductInfor {
    content: string;
    features: string;
    careGuide: string;
}

export interface SeedDetail {
    germinationRate: string;
    harvestTime: string;
    water: string;
    sowingSeason: string;
    difficulty: string;
}

export interface PotDetail {
    material: string;
    pattern?: string;
}

export interface PotVariant {
    id: number;
    color: string;
    size: string;
    volume: string;
    stock: number;
    price: number;
    image: string;
}
export interface SuppliesDetail {
    commonName: string;
    origin: string;
    material: string;
    application: string;
    packaging: string;
    volume?: string | null;
}


// Kế thừa Product list, thêm tất cả field detail
export interface ProductDetail extends ProductBase {
    description: string;
    stock: number;
    status: "active" | "inactive";
    type: ProductType;

    category: Category;
    attributes: Attribute[];
    images: ProductImage[];
    dimensions?: ProductDimensions;
    plantDetail?: PlantDetail;
    seedDetail?: SeedDetail;
    potDetail?: PotDetail;
    variants?: PotVariant[];
    suppliesDetail?: SuppliesDetail;
    wholesalePrices?: WholesalePrice[];
    infor?: ProductInfor;
}