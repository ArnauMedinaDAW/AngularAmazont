import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { CarritoService } from './services/carrito.service';
import { AutenticacioService } from './services/autenticacio.service';
import { Usuari } from './intarfaces/Usuari.interface';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularAmazont';
  oscuro: boolean = false;
  cartCount: number = 0;
  usuariActual: Usuari | null = null;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private themeService: ThemeService,
    private carritoService: CarritoService,
    private autenticacioService: AutenticacioService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to theme changes
    this.subscriptions.push(
      this.themeService.darkMode$.subscribe(isDark => {
        this.oscuro = isDark;
      })
    );

    // Subscribe to cart changes
    this.subscriptions.push(
      this.carritoService.cart$.subscribe(() => {
        this.cartCount = this.carritoService.obtenirQuantitatCarret();
      })
    );

    // Subscribe to user authentication changes
    this.subscriptions.push(
      this.autenticacioService.usuari$.subscribe(user => {
        this.usuariActual = user;
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  canviarTema() {
    this.themeService.toggleDarkMode();
  }

  onActivate(event: any) {
    // You can handle component activation here if needed
  }

  logout(): void {
    this.autenticacioService.logout();
    // Navigate to authentication component
    this.router.navigate(['/autenticacio']);
  }
}
