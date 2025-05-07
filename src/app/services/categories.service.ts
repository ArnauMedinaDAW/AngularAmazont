import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, forkJoin, map, switchMap } from 'rxjs';
import { Categoria } from '../intarfaces/Categoria.interface';
import { Product } from '../intarfaces/Product.intarface';
import { ProductesService } from './productes.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private httpClient: HttpClient,
    private productesService: ProductesService
  ) { }

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

  // Get categories with their products
  getCategoriesWithProducts(): Observable<Categoria[]> {
    return this.getCategories().pipe(
      map(categories => {
        const categoriesWithProductsRequests = categories.map(category => {
          return this.productesService.getProductsByCategory(category.id).pipe(
            map(products => {
              return { ...category, product: products };
            }),
            catchError(error => {
              console.error(`Error loading products for category ${category.id}:`, error);
              return of({ ...category, product: [] });
            })
          );
        });
        
        return forkJoin(categoriesWithProductsRequests);
      }),
      catchError(error => {
        console.error('Error in getCategoriesWithProducts:', error);
        return of([]);
      }),
      // Flatten the observable
      switchMap(obs => obs)
    );
  }
}