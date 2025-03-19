import { Injectable } from '@angular/core';
import { Usuari } from '../intarfaces/Usuari.interface';

@Injectable({
  providedIn: 'root'
})
export class AutenticacioService {
  private usuaris: Usuari[] = [
    { 
      nom: 'Arnau',
      correo: 'arnau@admin.com', 
      password: 'arnau123',
      rol: 'admin'
    },
    { 
      nom: 'David',
      correo: 'david@admin.com', 
      password: 'david123',
      rol: 'admin'
    }
  ];

  constructor() { }

  getUsuaris(): Usuari[] {
    return this.usuaris;
  }

  validarUsuari(correo: string, password: string): boolean {
    return this.usuaris.some(usuari => 
      usuari.correo === correo && usuari.password === password
    );
  }

  registrarUsuari(usuari: Usuari): boolean {
    if (this.usuaris.some(u => u.correo === usuari.correo)) {
      return false;
    }
    this.usuaris.push(usuari);
    return true;
  }
} 