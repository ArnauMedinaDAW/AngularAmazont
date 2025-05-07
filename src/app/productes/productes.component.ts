import { Component, OnInit } from '@angular/core';
import { Product } from '../intarfaces/Product.intarface';
import { NgClass, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';
import { ProductesService } from '../services/productes.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-productes',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './productes.component.html',
  styleUrl: './productes.component.css'
})
export class ProductesComponent implements OnInit {
  product!: Product;
  isFromCategories: boolean = false;
  buscarText: string = '';
  quantity: number = 1;
  showReviews: boolean = false;
  loading: boolean = true;
  error: string = '';
  oscuro: boolean = false;

  // Products array that will be populated from API
  products: Product[] = [];
  productsFiltrats: Product[] = [];

  constructor(
    private router: Router,
    private carritoService: CarritoService,
    private productesService: ProductesService,
    private themeService: ThemeService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.product = navigation.extras.state['product'];
      this.isFromCategories = navigation.extras.state['isFromCategories'] || false;
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    
    // Subscribe to theme changes
    this.themeService.darkMode$.subscribe(isDark => {
      this.oscuro = isDark;
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productesService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.productsFiltrats = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Error al cargar los productos. Por favor, inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  index = 0;
  productesPerSlide = 5;

  get grupProductes() {
    return this.productsFiltrats.slice(this.index, this.index + this.productesPerSlide);
  }

  seguentSlide() {
    if (this.index + this.productesPerSlide < this.products.length) {
      this.index += this.productesPerSlide;
    } else {
      this.index = 0;
    }
  }

  anteriorSlide() {
    if (this.index > 0) {
      this.index -= this.productesPerSlide;
    } else {
      this.index = this.products.length - this.productesPerSlide;
    }
  }

  verDetalles(product: any) {
    this.product = product;
    this.isFromCategories = true;
  }

  buscarProducte(filtre: string) {
    const valor = filtre.toLowerCase().trim();
    this.productsFiltrats = this.products.filter(product => 
      product.nombre.toLowerCase().includes(valor)
    );
  }

  toggleReviews() {
    this.showReviews = !this.showReviews;
  }

  incrementQuantity() {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  addToCart(product: Product, quantity: number) {
    this.carritoService.afegirAlCarret(product, quantity);
    // Show a confirmation message
    alert(`${product.nombre} añadido al carrito`);
  }
}