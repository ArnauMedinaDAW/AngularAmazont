import { Injectable } from '@angular/core';
import { Product } from '../intarfaces/Product.intarface';
import { CartItem } from '../intarfaces/Carrito.interface';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AutenticacioService } from './autenticacio.service';

// Re-export the CartItem interface so components can import it from here
export type { CartItem } from '../intarfaces/Carrito.interface';

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
    const usuari = this.authService.getUsuariActual();
    
    if (usuari && usuari.id) {
      // User is logged in, get cart from API
      this.httpClient.get<any[]>(`${this.apiUrl}/carrito/activo/${usuari.id}`)
        .subscribe({
          next: (response) => {
            if (response && response.length > 0) {
              // Transform API response to CartItem format
              this.cartItems = response.map(item => ({
                id: item.id,
                product: {
                  id: item.producto.id,
                  nombre: item.producto.nombre,
                  descripcion: item.producto.descripcion,
                  imagen: item.producto.imagen,
                  precio: parseFloat(item.producto.precio),
                  stock: item.producto.stock,
                  categoria_id: item.producto.categoria_id,
                  nota: item.producto.nota
                },
                cantidad: item.cantidad,
                precio_total: parseFloat(item.preciototal),
                iduser: item.iduser,
                estado: item.estado
              }));
              
              this.cartSubject.next(this.cartItems);
            } else {
              // Empty cart
              this.cartItems = [];
              this.cartSubject.next(this.cartItems);
            }
          },
          error: (error) => {
            console.error('Error loading cart from API:', error);
            // Fallback to localStorage if API fails
            this.carregarCarretLocal();
          }
        });
    } else {
      // User not logged in, use localStorage
      this.carregarCarretLocal();
    }
  }
  
  // Fallback method to load cart from localStorage
  private carregarCarretLocal() {
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
          alert(`API carrito OK ` + response);
        },
        error: (error) => {
          alert(`API carrito OK ` + error);
        }
      });
    } else {
      console.log('User not logged in or missing ID, cart only saved locally');
    }
  }
  
  eliminarDelCarret(cartItemId: number) {
    // Find the item to get its product ID for local storage filtering
    const itemToDelete = this.cartItems.find(item => item.id === cartItemId);
    
    if (itemToDelete) {
      // If user is logged in, delete from API and reload cart
      const usuari = this.authService.getUsuariActual();
      if (usuari && usuari.id) {
        this.httpClient.delete(`${this.apiUrl}/carrito/${cartItemId}`).subscribe({
          next: (response) => {
            console.log('Item successfully deleted from API cart');
            // Reload the entire cart from API to ensure consistency
            this.carregarCarret();
          },
          error: (error) => {
            console.error('Error deleting item from API cart:', error);
            // If API fails, just remove from local array
            this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
            this.guardarCarret();
          }
        });
      } else {
        // User not logged in, just update local storage
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
        this.guardarCarret();
      }
    }
  }
  
  actualitzarQuantitat(cartItemId: number, quantity: number) {
    const item = this.cartItems.find(item => item.id === cartItemId);
    if (item) {
      // Update local cart item
      item.cantidad = quantity;
      // Calculate new total price
      const precioTotal = item.product.precio * quantity;
      
      // If user is logged in, update via API
      const usuari = this.authService.getUsuariActual();
      if (usuari && usuari.id) {
        this.httpClient.post(`${this.apiUrl}/carrito/updateCantidadPrecio`, {
          id: cartItemId,
          cantidad: quantity,
        }).subscribe({
          next: (response) => {
            console.log('Cart item quantity updated successfully in API');
            // Reload cart to ensure consistency
            this.carregarCarret();
          },
          error: (error) => {
            console.error('Error updating cart item quantity in API:', error);
            // If API fails, at least update local storage
            this.guardarCarret();
          }
        });
      }
    }
  }
  buidarCarret() {
    const usuari = this.authService.getUsuariActual();
    
    if (usuari && usuari.id && this.cartItems.length > 0) {
      // Get all cart item IDs
      const cartItemIds = this.cartItems
        .filter(item => item.id !== undefined)
        .map(item => item.id);
      
      if (cartItemIds.length > 0) {
        // Call API to delete multiple cart items
        this.httpClient.post(`${this.apiUrl}/carritos/eliminar-varios`, {
          ids: cartItemIds
        }).subscribe({
          next: (response) => {
            console.log('Cart successfully cleared via API');
            // Clear local cart
            this.cartItems = [];
            this.guardarCarret();
          },
          error: (error) => {
            console.error('Error clearing cart via API:', error);
            // Still clear local cart even if API fails
          }
        });
      }
    }
  }
  
  finalitzarCompra() {
    const usuari = this.authService.getUsuariActual();
    
    if (usuari && usuari.id && this.cartItems.length > 0) {
      // Call API to finalize the purchase
      return this.httpClient.put(`${this.apiUrl}/carrito/finalizar/${usuari.id}`, {})
        .subscribe({
          next: (response) => {
            console.log('Purchase successfully finalized via API');
            // Clear local cart after successful API call
            this.cartItems = [];
            this.guardarCarret();
          },
          error: (error) => {
            console.error('Error finalizing purchase via API:', error);
            // Don't clear cart if API fails
          }
        });
    } else {
      // If user not logged in or cart is empty, just clear local cart
      this.cartItems = [];
      this.guardarCarret();
      return null;
    }
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