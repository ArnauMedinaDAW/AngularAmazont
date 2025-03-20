import { Injectable } from '@angular/core';
import { Usuari } from '../intarfaces/Usuari.interface';

@Injectable({
  providedIn: 'root',
})
export class AutenticacioService {
  private readonly STORAGE_KEY = 'usuaris'; //Key objecte usuaris local storage
  private usuaris: Usuari[] = [];

  constructor() {

    this.cargarUsuaris();
  }
  private cargarUsuaris() {

    const usuarisGuardats = localStorage.getItem(this.STORAGE_KEY);

    if (usuarisGuardats) {
      //Obtenir usuaris guardats localment
      this.usuaris = JSON.parse(usuarisGuardats);
    } else {
      //Usuaris hardcored
      this.usuaris = [
        {
          nom: 'Arnau',
          correo: 'arnau@admin.com',
          password: 'arnau123',
          rol: 'admin',
        },
        {
          nom: 'David',
          correo: 'david@admin.com',
          password: 'david123',
          rol: 'admin',
        },
      ];
      this.guardarUsuaris();
    }
  }
  //Gaurdar localment els usuaris
  private guardarUsuaris() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuaris));
  }

  getUsuaris(): Usuari[] {
    return this.usuaris;
  }

  //Validar el login
  validarUsuari(correo: string, password: string): boolean {
    return this.usuaris.some(
      (usuari) => usuari.correo === correo && usuari.password === password
    );
  }
  //Validar el register
  registrarUsuari(usuari: Usuari): boolean {
    if (this.usuaris.some((u) => u.correo === usuari.correo)) {
      return false;
    }
    this.usuaris.push(usuari);
    this.guardarUsuaris();
    return true;
  }
}
