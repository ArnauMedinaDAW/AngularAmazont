import { Product } from "./Product.intarface";

export interface Categoria {
    id: number;
    name: string;
    product : Product[]
    img : string[];
 }