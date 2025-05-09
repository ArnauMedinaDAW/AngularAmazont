import { Product } from "./Product.intarface";

export interface CartItem {
    id?: number;
    product: Product;
    cantidad: number;
    precio_total?: number;
    iduser?: number;
    estado?: string;
}