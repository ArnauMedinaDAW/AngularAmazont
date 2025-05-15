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
export class AdminProductesComponent implements OnInit, OnDestroy {
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
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.darkMode$.subscribe(isDark => {
      this.oscuro = isDark;
    });
    
    // Load products
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
        // Update the product in the local array
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.cancelEditing();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        // You could add error handling here, like showing a message to the user
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  // Add this method to handle product deletion
  deleteProduct(product: Product): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`)) {
      this.productesService.deleteProduct(product.id).subscribe({
        next: () => {
          // Remove the product from the local array
          this.products = this.products.filter(p => p.id !== product.id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error al eliminar el producto. Por favor, inténtelo de nuevo más tarde.');
        }
      });
    }
  }

  // Add these properties
  showCreateForm: boolean = false;
  newProduct: Partial<Product> = {
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: 0,
    stock: 0,
    categoria_id: 1, // Default category
    nota: 0
  };

  // Add this method to toggle the create form
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      // Reset the form when closing
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

  // Add this method to create a new product
  createProduct(): void {
    if (!this.newProduct.nombre || !this.newProduct.imagen) {
      alert('Por favor, complete al menos el nombre y la URL de la imagen.');
      return;
    }

    this.productesService.createProduct(this.newProduct).subscribe({
      next: (createdProduct) => {
        // Add the new product to the local array
        this.products.push(createdProduct);
        this.toggleCreateForm(); // Close the form
      },
      error: (error) => {
        console.error('Error creating product:', error);
        alert('Error al crear el producto. Por favor, inténtelo de nuevo más tarde.');
      }
    });
  }
}
