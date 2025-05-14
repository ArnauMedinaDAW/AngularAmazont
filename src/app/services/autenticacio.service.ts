import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuari } from '../intarfaces/Usuari.interface';

@Injectable({
  providedIn: 'root',
})
export class AutenticacioService {
  private readonly STORAGE_KEY = 'usuari_actual'; // Store current user
  private apiUrl = 'http://127.0.0.1:8000/api';
  private usuariActual: Usuari | null = null;

  // Add a BehaviorSubject to track user state changes
  private usuariSubject = new BehaviorSubject<Usuari | null>(null);
  public usuari$ = this.usuariSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    // Check if user is already logged in
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      this.usuariActual = JSON.parse(storedUser);
      this.usuariSubject.next(this.usuariActual);
    }
  }

  // Validar el login
  validarUsuari(nick: string, password: string): Observable<boolean> {
    return this.httpClient.post<Usuari>(`${this.apiUrl}/auth/login`, {
      nick,
      password
    }).pipe(
      map(response => {
        if (response && response.id) {
          this.usuariActual = response;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuariActual));
          this.usuariSubject.next(this.usuariActual);
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
          this.usuariSubject.next(this.usuariActual);
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

  getUsuariActual(): Usuari | null {
    return this.usuariActual;
  }

  // Logout
  logout(): void {
    this.usuariActual = null;
    localStorage.removeItem(this.STORAGE_KEY);
    // Emit null to indicate logout
    this.usuariSubject.next(null);
  }

  // Add this method after getUsuariActual()
  actualizarUsuario(userId: string, userData: any): Observable<any> {
    // Include the ID in the request body as required by the Laravel backend
    const requestData = {
      id: userId,
      ...userData
    };

    return this.httpClient.post<any>(`${this.apiUrl}/auth/actualizar-perfil`, requestData).pipe(
      map(response => {
        if (response && response.user) {
          // Update the stored user data with the returned user object
          this.usuariActual = {
            ...this.usuariActual,
            ...response.user
          };

          // Update localStorage
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuariActual));

          // Notify subscribers about the user update
          this.usuariSubject.next(this.usuariActual);

          return response.user;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  actualizarContra(userId: string, userData: any): Observable<any> {
    // Include the ID in the request body as required by the Laravel backend
    const requestData = {
      id: userId,
      ...userData
    };

    return this.httpClient.post<any>(`${this.apiUrl}/auth/actualizar-contra`, requestData).pipe(
      map(response => {
        if (response && response.user) {
          // Update the stored user data with the returned user object
          this.usuariActual = {
            ...this.usuariActual,
            ...response.user
          };

          // Update localStorage
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuariActual));

          // Notify subscribers about the user update
          this.usuariSubject.next(this.usuariActual);

          return response.user;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error updating password:', error);
        return throwError(() => error);
      })
    );
  }

  // Add this method to handle payment methods
  getMetodosPago(userId: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/metodoPago?user_id=${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching payment methods:', error);
        return of([]);
      })
    );
  }

  addMetodoPago(userId: string, metodoPago: any): Observable<any> {
    const requestData = {
      ...metodoPago,
      user_id: userId
    };
    
    return this.httpClient.post<any>(`${this.apiUrl}/metodoPago`, requestData).pipe(
      catchError(error => {
        console.error('Error adding payment method:', error);
        return throwError(() => error);
      })
    );
  }

  updateMetodoPago(metodoPagoId: string, metodoPago: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/metodoPago/${metodoPagoId}`, metodoPago).pipe(
      catchError(error => {
        console.error('Error updating payment method:', error);
        return throwError(() => error);
      })
    );
  }

  deleteMetodoPago(metodoPagoId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/metodoPago/${metodoPagoId}`).pipe(
      catchError(error => {
        console.error('Error deleting payment method:', error);
        return throwError(() => error);
      })
    );
  }
}
