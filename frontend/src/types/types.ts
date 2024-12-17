import React from 'react'; 

export interface AuthenticationProps {
  isAuthenticated?: boolean,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export type Product = {
    id: number,
    name: string,
    slug: string,
    created: string,
    updated: string,
    image: string,
    category: number,
    price: number | string,
    quantity?: number
}

export interface formProps extends AuthenticationProps {
    route: string;
    name: string;
}

export type Category = {
    id?: number,
    name: string,
    slug?: string,
}

export interface CartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cart?: any | object,
    setCart?: React.Dispatch<React.SetStateAction<object | null>>
}

export interface CardProps extends CartProps {
    product: Product,
}

