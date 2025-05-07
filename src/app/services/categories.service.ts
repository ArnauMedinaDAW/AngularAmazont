import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Categoria } from '../intarfaces/Categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private httpClient: HttpClient) { }

  // Get all categories
  getCategories(): Observable<Categoria[]> {
    return this.httpClient.get<Categoria[]>(`${this.apiUrl}/categories`).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  // Get a single category by ID
  getCategory(id: number): Observable<Categoria> {
    return this.httpClient.get<Categoria>(`${this.apiUrl}/categories/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching category with id ${id}:`, error);
        throw error;
      })
    );
  }

  // Get products for a specific category
  getProductsByCategory(categoryId: number): Observable<Categoria> {
    return this.httpClient.get<Categoria>(`${this.apiUrl}/categories/${categoryId}`).pipe(
      catchError(error => {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        throw error;
      })
    );
  }
}