export interface Usuari {
    id?: number;
    nick: string;
    email?: string;
    password?: string;   
    rol?: 'usuario' | 'admin';
    direccion_envio?: string;   
} 