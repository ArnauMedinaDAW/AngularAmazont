import { Injectable } from '@angular/core';
import { Product } from '../intarfaces/Product.intarface';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly STORAGE_KEY = 'carrito';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  cart$ = this.cartSubject.asObservable();
  
  constructor() {
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
  
  afegirAlCarret(product: Product, quantity: number = 1) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.guardarCarret();
  }
  
  eliminarDelCarret(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.guardarCarret();
  }
  
  actualitzarQuantitat(productId: number, quantity: number) {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
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
      total + (item.product.price * item.quantity), 0);
  }
  
  obtenirQuantitatCarret(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}