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
    return this.httpClient.get<Product[]>(`${this.apiUrl}/products/categoria/${categoryId}`).pipe(
      catchError(error => {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        return of([]);
      })
    );
  }

  // Update a product
  updateProduct(product: Partial<Product>): Observable<Product> {
    if (!product.id) {
      throw new Error("Product ID is required for update");
    }
  
    return this.httpClient.put<Product>(`${this.apiUrl}/products/${product.id}`, product).pipe(
      catchError(error => {
        console.error(`Error updating product with id ${product.id}:`, error);
        throw error;
      })
    );
  }
  
  // Delete a product
  deleteProduct(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting product with id ${id}:`, error);
        throw error;
      })
    );
  }

  // Create a new product
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.httpClient.post<Product>(`${this.apiUrl}/products`, product).pipe(
      catchError(error => {
        console.error('Error creating product:', error);
        throw error;
      })
    );
  }
}