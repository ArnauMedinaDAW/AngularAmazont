import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service';
import { ProductesService } from '../services/productes.service';
import { Product } from '../intarfaces/Product.intarface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-productes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-productes.component.html',
  styleUrls: ['./admin-productes.component.css']
})
export class AdminProductesComponent implements OnInit {
  oscuro: boolean = false;
  products: Product[] = [];
  loading: boolean = true;
  error: string = '';
  editingProductId: number | null = null;
  editingProduct: Partial<Product> = {};
  
  private themeSubscription: Subscription | null = null;
  private productsSubscription: Subscription | null = null;

  constructor(
    private themeService: ThemeService,
    private productesService: ProductesService
  ) {}

  ngOnInit(): void {
    // Subscriu-se als canvis del tema
    this.themeSubscription = this.themeService.darkMode$.subscribe(isDark => {
      this.oscuro = isDark;
    });
    
    // Carrega els productes
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsSubscription = this.productesService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Error al cargar los productos. Por favor, inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  startEditing(product: Product): void {
    this.editingProductId = product.id;
    this.editingProduct = { ...product };
  }

  cancelEditing(): void {
    this.editingProductId = null;
    this.editingProduct = {};
  }

  saveProduct(): void {
    if (!this.editingProduct || !this.editingProductId) return;

    const productToUpdate = {
      id: this.editingProductId,
      ...this.editingProduct
    };

    this.productesService.updateProduct(productToUpdate).subscribe({
      next: (updatedProduct) => {
        // Actualitza el producte a l'array local
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.cancelEditing();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        // Podries afegir gestió d'errors aquí, com mostrar un missatge a l'usuari
      }
    });
  }



  // Mètode per gestionar l'eliminació de productes
  deleteProduct(product: Product): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`)) {
      this.productesService.deleteProduct(product.id).subscribe({
        next: () => {
          // Elimina el producte de l'array local
          this.products = this.products.filter(p => p.id !== product.id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error al eliminar el producto. Por favor, inténtelo de nuevo más tarde.');
        }
      });
    }
  }

  // Propietats per al formulari de creació
  showCreateForm: boolean = false;
  newProduct: Partial<Product> = {
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: 0,
    stock: 0,
    categoria_id: 1, // Categoria per defecte
    nota: 0
  };

  // Mètode per mostrar/ocultar el formulari de creació
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      // Reinicia el formulari quan es tanca
      this.newProduct = {
        nombre: '',
        descripcion: '',
        imagen: '',
        precio: 0,
        stock: 0,
        categoria_id: 1,
        nota: 0
      };
    }
  }

  // Mètode per crear un nou producte
  createProduct(): void {
    if (!this.newProduct.nombre || !this.newProduct.imagen) {
      alert('Por favor, complete al menos el nombre y la URL de la imagen.');
      return;
    }

    this.productesService.createProduct(this.newProduct).subscribe({
      next: (createdProduct) => {
        // Afegeix el nou producte a l'array local
        this.products.push(createdProduct);
        this.toggleCreateForm(); // Tanca el formulari
      },
      error: (error) => {
        console.error('Error creating product:', error);
        alert('Error al crear el producto. Por favor, inténtelo de nuevo más tarde.');
      }
    });
  }
}
