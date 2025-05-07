import { Product } from "./Product.intarface";

export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    imagen?: string | null;
    product: Product[];
    img?: string[];
    created_at?: string;
    updated_at?: string;
}