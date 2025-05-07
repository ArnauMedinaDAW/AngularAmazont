import { Component, OnInit } from '@angular/core';
import { Categoria } from '../intarfaces/Categoria.interface';
import { RouterOutlet, RouterLink} from '@angular/router';
import { Router } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common';
import { Product } from '../intarfaces/Product.intarface';
import { MenuIniciComponent } from "../menu-inici/menu-inici.component";
import { CategoriesService } from '../services/categories.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgClass, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})

export class CategoriesComponent implements OnInit {
  oscuro: boolean = false;

  buscarText: string = '';
  categories: Categoria[] = [];
  selectedCategory: Categoria | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    // Subscribe to theme changes
    this.themeService.darkMode$.subscribe(isDark => {
      this.oscuro = isDark;
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';
    
    // Use the new method to get categories with products in one call
    this.categoriesService.getCategoriesWithProducts().subscribe({
      next: (categoriesWithProducts) => {
        this.categories = categoriesWithProducts;
        this.loading = false;
        console.log('Categories with products:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories with products:', error);
        this.error = 'Error al cargar las categorías y productos. Por favor, inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  selectCategory(category: Categoria) {
    // Since we already have the products loaded, we can just set the selected category
    this.selectedCategory = category;
  }

  sortByPrice(order: 'asc' | 'desc'): void {
    if (this.selectedCategory && this.selectedCategory.product) {
      this.selectedCategory.product.sort((a, b) => {
        return order === 'asc' ? a.precio - b.precio : b.precio - a.precio;
      });
    }
  }

  sortByRate(order: 'asc' | 'desc'): void {
    if (this.selectedCategory && this.selectedCategory.product) {
      this.selectedCategory.product.sort((a, b) => {
        return order === 'asc' ? a.nota - b.nota : b.nota - a.nota;
      });
    }
  }
  
  goToProduct(product: Product) {
    console.log('Navegando a producto:', product);
    this.router.navigate(['/menu/productes'], { state: { product, isFromCategories: true } });
  }
}
