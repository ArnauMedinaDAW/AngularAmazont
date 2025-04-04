import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService, CartItem } from '../services/carrito.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacioService } from '../services/autenticacio.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    if (novaQuantitat > 0 && novaQuantitat <= 10) {
      this.carritoService.actualitzarQuantitat(item.product.id, novaQuantitat);
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
  finalitzarCompra(): void {
    // Aquí s'implementaria la lògica de pagament
    alert('Gràcies per la teva compra!');
    this.carritoService.buidarCarret();
    this.router.navigate(['/menu/productes']);
  }
  
  // Continua comprant
  continuarComprant(): void {
    this.router.navigate(['/menu/productes']);
  }
}
