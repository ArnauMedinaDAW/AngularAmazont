import { Injectable } from '@angular/core';
import { Product } from '../intarfaces/Product.intarface';
import { CartItem } from '../intarfaces/Carrito.interface';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AutenticacioService } from './autenticacio.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly STORAGE_KEY = 'carrito';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private apiUrl = 'http://127.0.0.1:8000/api';
  
  cart$ = this.cartSubject.asObservable();
  
  constructor(
    private httpClient: HttpClient,
    private authService: AutenticacioService
  ) {
    this.carregarCarret();
  }
  
  private carregarCarret() {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }
  
  private guardarCarret() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }
  
  afegirAlCarret(product: Product, cantidad: number = 1) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      this.cartItems.push({ product, cantidad });
    }
    
    this.guardarCarret();
    
    // Send to API if user is logged in
    const usuari = this.authService.getUsuariActual();
    if (usuari && usuari.id) {
      const precioTotal = product.precio * cantidad;
      
      this.httpClient.post(`${this.apiUrl}/carrito`, {
        idproducto: product.id,
        cantidad: cantidad,
        preciototal: precioTotal,
        iduser: usuari.id
      }).subscribe({
        next: (response) => {
          console.log('Product added to cart in API:', response);
        },
        error: (error) => {
          console.error('Error adding product to cart in API:', error);
        }
      });
    } else {
      console.log('User not logged in or missing ID, cart only saved locally');
    }
  }
  
  eliminarDelCarret(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.guardarCarret();
  }
  
  actualitzarQuantitat(productId: number, quantity: number) {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.cantidad = quantity;
      this.guardarCarret();
    }
  }
  
  buidarCarret() {
    this.cartItems = [];
    this.guardarCarret();
  }
  
  obtenirElementsCarret(): CartItem[] {
    return this.cartItems;
  }
  
  obtenirTotalCarret(): number {
    return this.cartItems.reduce((total, item) => 
      total + (item.product.precio * item.cantidad), 0);
  }
  
  obtenirQuantitatCarret(): number {
    return this.cartItems.reduce((count, item) => count + item.cantidad, 0);
  }
}