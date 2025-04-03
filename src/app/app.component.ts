import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common';
import { CarritoService } from './services/carrito.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  oscuro = false;
  componentActual: any = null;
  cartCount = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.cart$.subscribe(() => {
      this.cartCount = this.carritoService.getCartCount();
    });
    
    // Check if dark mode was previously set
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      this.oscuro = true;
      document.getElementById('themeSwitch')?.classList.add('active');
    }
  }

  canviarTema() {
    this.oscuro = !this.oscuro;
    
    // Save theme preference
    localStorage.setItem('darkMode', this.oscuro.toString());

    // Update child components
    if (this.componentActual && 'oscuro' in this.componentActual) {
      this.componentActual.oscuro = this.oscuro;
    }

    // Update switch appearance
    const botoSwitch = document.getElementById('themeSwitch');
    if (this.oscuro) {
      botoSwitch?.classList.add('active');
    } else {
      botoSwitch?.classList.remove('active');
    }
    
    // Apply theme to body for global styles
    if (this.oscuro) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  onActivate(component: any) {
    this.componentActual = component;

    if ('oscuro' in component) {
      component.oscuro = this.oscuro;
    }
  }
}
