export interface Usuari {
    correo: string;
    password: string;
    nom: string;
    rol: 'usuari' | 'admin';
} 