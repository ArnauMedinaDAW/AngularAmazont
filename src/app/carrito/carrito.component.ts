import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService, CartItem } from '../services/carrito.service';
import { FormsModule } from '@angular/forms';
import { MenuIniciComponent } from '../menu-inici/menu-inici.component';
import { Router } from '@angular/router';
import { AutenticacioService } from '../services/autenticacio.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuIniciComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  shippingCost: number = 4.99;
  
  oscuro = input.required<boolean>();
  
  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private authService: AutenticacioService
  ) {}
  
  ngOnInit(): void {
    this.loadCartItems();
    this.carritoService.cart$.subscribe(() => {
      this.loadCartItems();
    });
  }
  
  loadCartItems(): void {
    this.cartItems = this.carritoService.getCartItems();
    this.calculateTotal();
  }
  
  calculateTotal(): void {
    this.total = this.carritoService.getCartTotal();
  }
  
  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0 && newQuantity <= 10) {
      this.carritoService.updateQuantity(item.product.id, newQuantity);
    }
  }
  
  removeItem(productId: number): void {
    this.carritoService.removeFromCart(productId);
  }
  
  clearCart(): void {
    this.carritoService.clearCart();
  }
  
  checkout(): void {
    // Here you would implement the checkout logic
    alert('¡Gracias por tu compra!');
    this.carritoService.clearCart();
    this.router.navigate(['/menu/productes']);
  }
  
  continueShopping(): void {
    this.router.navigate(['/menu/productes']);
  }
}
