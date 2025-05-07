import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Product } from '../intarfaces/Product.intarface';

@Injectable({
  providedIn: 'root'
})
export class ProductesService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private httpClient: HttpClient) { }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
  }

  // Get a single product by ID
  getProduct(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
      })
    );
  }

  // Get products by category
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`).pipe(
      catchError(error => {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        return of([]);
      })
    );
  }
}