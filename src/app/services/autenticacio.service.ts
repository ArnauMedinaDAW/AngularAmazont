import { Injectable } from '@angular/core';
import { Usuari } from '../intarfaces/Usuari.interface';

@Injectable({
  providedIn: 'root'
})
export class AutenticacioService {
  private readonly STORAGE_KEY = 'usuaris';
  private usuaris: Usuari[] = [];

  constructor() {
    // Cargar usuarios del localStorage al iniciar
    this.cargarUsuaris();
  }

  private cargarUsuaris() {
    const usuarisGuardats = localStorage.getItem(this.STORAGE_KEY);
    if (usuarisGuardats) {
      this.usuaris = JSON.parse(usuarisGuardats);
    } else {
      // Si no hay usuarios guardados, inicializar con los usuarios por defecto
      this.usuaris = [
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
      this.guardarUsuaris();
    }
  }

  private guardarUsuaris() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuaris));
  }

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
    this.guardarUsuaris();
    return true;
  }
} 