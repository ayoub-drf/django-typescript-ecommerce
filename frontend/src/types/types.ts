export type Product = {
    id: number,
    name: string,
    slug: string,
    created: string,
    updated: string,
    image: string,
    category: number,
}

export interface formProps {
    route: string;
    name: string;
}

export type Category = {
    id?: number,
    name: string,
    slug?: string,
}

export type CardProps = {
    product: Product
}