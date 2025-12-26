export interface Attribute {
    id: number;
    name: string;
    slug: string;
}

export interface AttributeGroup {
    group: {
        id: number;
        name: string;
        slug: string;
    };
    attributes: Attribute[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    attribute_groups: AttributeGroup[];
}

export interface CategoryResponse {
    categories: Category[];
}
