import { Product } from "./Product.intarface";

export interface CartItem {
    id?: number;
    product: Product;
    cantidad: number;
    precio_total?: number;
    id_user?: number;
    estado?: string;
}