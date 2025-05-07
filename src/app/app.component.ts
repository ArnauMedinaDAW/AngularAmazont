import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common';
import { CarritoService } from './services/carrito.service';
import { Categoria } from './intarfaces/Categoria.interface';
import { HttpClientModule } from '@angular/common/http';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  oscuro = false;
  componentActual: any = null;
  cartCount = 0;
  categorias: Categoria[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.carritoService.cart$.subscribe(() => {
      this.cartCount = this.carritoService.obtenirQuantitatCarret();
    });
    
    // Subscribe to theme changes
    this.themeService.darkMode$.subscribe(isDark => {
      this.oscuro = isDark;
      
      // Update switch UI
      const botoSwitch = document.getElementById('themeSwitch');
      if (isDark) {
        botoSwitch?.classList.add('active');
      } else {
        botoSwitch?.classList.remove('active');
      }
      
      // Update body class for global styling
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
    
    // Check if theme was previously set
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      this.themeService.setDarkMode(true);
    }
  }

  canviarTema() {
    this.themeService.toggleDarkMode();
  }

  onActivate(component: any) {
    this.componentActual = component;

    if ('oscuro' in component) {
      component.oscuro = this.oscuro;
    }
  }
}
