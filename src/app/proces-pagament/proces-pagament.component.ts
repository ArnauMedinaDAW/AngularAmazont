import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, CartItem } from '../services/carrito.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-proces-pagament',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proces-pagament.component.html',
  styleUrl: './proces-pagament.component.css'
})
export class ProcesPagamentComponent implements OnInit, OnDestroy {
  formulariPagament!: FormGroup;
  elementsCarret: CartItem[] = [];
  total: number = 0;
  costEnviament: number = 0;
  metodesPagament = ['Tarjeta de crédito', 'PayPal', 'Transferencia bancaria'];
  metodePagamentSeleccionat: string = 'Tarjeta de crédito';
  mostrarFormulariTarjeta: boolean = true;
  processantPagament: boolean = false;
  pagamentExitos: boolean = false;
  
  oscuro = signal<boolean>(false);
  private themeSubscription: Subscription | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private carritoService: CarritoService,
    private themeService: ThemeService
  ) {
    const navegacio = this.router.getCurrentNavigation();
    if (navegacio?.extras.state) {
      this.elementsCarret = navegacio.extras.state['cartItems'];
      this.total = navegacio.extras.state['total'];
      this.costEnviament = navegacio.extras.state['shippingCost'];
    } else {
      this.router.navigate(['/menu/carrito']);
    }
  }
  
  ngOnInit(): void {
    this.inicialitzarFormulari();
    window.scrollTo(0, 0);
    
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.darkMode$.subscribe(isDark => {
      this.oscuro.set(isDark);
    });
    
    // Initialize with current theme state
    this.oscuro.set(this.themeService.isDarkMode());
  }
  
  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
  
  inicialitzarFormulari(): void {
    this.formulariPagament = this.fb.group({
      // Adreça d'enviament
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      adreca: ['', Validators.required],
      ciutat: ['', Validators.required],
      codiPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      pais: ['España', Validators.required],
      
      // Mètode de pagament
      metodePagament: [this.metodePagamentSeleccionat],
      
      // Detalls de la targeta
      numeroTarjeta: ['', [Validators.pattern(/^\d{16}$/)]],
      nomTarjeta: [''],
      dataExpiracio: [''],
      cvv: ['', [Validators.pattern(/^\d{3,4}$/)]],
      
      // Termes
      acceptarTermes: [false, Validators.requiredTrue]
    });
    
    // Afegir validació condicional basada en el mètode de pagament
    this.formulariPagament.get('metodePagament')?.valueChanges.subscribe(metode => {
      this.metodePagamentSeleccionat = metode;
      this.mostrarFormulariTarjeta = metode === 'Tarjeta de crédito';
      
      const controlsTarjeta = ['numeroTarjeta', 'nomTarjeta', 'dataExpiracio', 'cvv'];
      
      if (this.mostrarFormulariTarjeta) {
        controlsTarjeta.forEach(control => {
          this.formulariPagament.get(control)?.setValidators([Validators.required]);
        });
      } else {
        controlsTarjeta.forEach(control => {
          this.formulariPagament.get(control)?.clearValidators();
        });
      }
      
      controlsTarjeta.forEach(control => {
        this.formulariPagament.get(control)?.updateValueAndValidity();
      });
    });
  }
  
  enviarFormulari(): void {
    if (this.formulariPagament.invalid) {
      // Marcar tots els camps com a tocats per mostrar errors de validació
      Object.keys(this.formulariPagament.controls).forEach(key => {
        this.formulariPagament.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.processantPagament = true;
    
    // Simular processament del pagament
    setTimeout(() => {
      this.processantPagament = false;
      this.pagamentExitos = true;
      
      // Després de 3 segons, completar la compra i redirigir
      setTimeout(() => {
        // Use the new finalitzarCompra method instead of buidarCarret
        this.carritoService.finalitzarCompra();
        this.router.navigate(['/menu/productes']);
      }, 3000);
    }, 5000);
  }
  
  cancelarPagament(): void {
    this.router.navigate(['/menu/carrito']);
  }
}
