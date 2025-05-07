import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuari } from '../intarfaces/Usuari.interface';

@Injectable({
  providedIn: 'root',
})
export class AutenticacioService {
  private readonly STORAGE_KEY = 'usuari_actual'; // Store current user
  private apiUrl = 'http://127.0.0.1:8000/api';
  private usuariActual: Usuari | null = null;

  constructor(private httpClient: HttpClient) {
    // Check if user is already logged in
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      this.usuariActual = JSON.parse(storedUser);
    }
  }

  // Validar el login
  validarUsuari(nick: string, password: string): Observable<boolean> {
    return this.httpClient.post<{message: string, user: Usuari}>(`${this.apiUrl}/auth/login`, { 
      nick, 
      password 
    }).pipe(
      map(response => {
        if (response && response.user) {
          // Store the complete user object from the API
          this.usuariActual = response.user;
          // Store user in localStorage
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuariActual));
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  // Validar el register
  registrarUsuari(usuari: Usuari): Observable<boolean> {
    return this.httpClient.post<{success: boolean, user?: Usuari}>(`${this.apiUrl}/auth/register`, usuari).pipe(
      map(response => {
        if (response.success && response.user) {
          this.usuariActual = response.user;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuariActual));
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of(false);
      })
    );
  }

  // Get current logged in user
  getUsuariActual(): Usuari | null {
    return this.usuariActual;
  }

  // Logout
  logout(): void {
    this.usuariActual = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
