import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService, CartItem } from '../services/carrito.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacioService } from '../services/autenticacio.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
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
    this.carregarElementsCarret();
    this.carritoService.cart$.subscribe(() => {
      this.carregarElementsCarret();
    });
  }
  
  // Carrega els elements del carret
  carregarElementsCarret(): void {
    this.cartItems = this.carritoService.obtenirElementsCarret();
    this.calcularTotal();
  }
  
  // Calcula el total de la compra
  calcularTotal(): void {
    this.total = this.carritoService.obtenirTotalCarret();
  }
  
  // Actualitza la quantitat d'un producte
  actualitzarQuantitat(item: CartItem, novaQuantitat: number): void {
    if (novaQuantitat > 0 && novaQuantitat <= 50) {
      this.carritoService.actualitzarQuantitat(item.id ||0 , novaQuantitat);
    }
  }
  
  // Elimina un producte del carret
  eliminarProducte(productId: number): void {
    this.carritoService.eliminarDelCarret(productId);
  }
  
  // Buida tot el carret
  buidarCarret(): void {
    this.carritoService.buidarCarret();
  }
  
  // Finalitza la compra
  iniciarProcesPagament(): void {
    // Navigate to payment process
    this.router.navigate(['/menu/carrito/pagament'], { 
      state: { 
        cartItems: this.cartItems,
        total: this.total,
        shippingCost: this.shippingCost
      } 
    });
  }
  
  finalitzarCompra(): void {
    // This method will be called from the payment process component
    alert('Gràcies per la teva compra!');
    this.carritoService.buidarCarret();
    this.router.navigate(['/menu/productes']);
  }
  
  // Continua comprant
  continuarComprant(): void {
    this.router.navigate(['/menu/productes']);
  }
}
