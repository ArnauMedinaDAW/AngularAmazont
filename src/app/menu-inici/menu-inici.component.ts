import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-inici',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, CommonModule],
  templateUrl: './menu-inici.component.html',
  styleUrl: './menu-inici.component.css'
})
export class MenuIniciComponent implements OnInit, OnDestroy {
  title = 'Amazont';
  oscuro = false;
  componentActual: any = null;
  private themeSubscription: Subscription | null = null;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Subscribe to theme changes from the ThemeService
    this.themeSubscription = this.themeService.darkMode$.subscribe(isDark => {
      this.oscuro = isDark;
      
      // Update child component if it exists
      if (this.componentActual && 'oscuro' in this.componentActual) {
        this.componentActual.oscuro = this.oscuro;
      }
    });
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  canviarTema() {
    // Use the ThemeService to toggle dark mode
    this.themeService.toggleDarkMode();
  }

  onActivate(component: any) {
    this.componentActual = component;

    // Set the dark mode value on the activated component
    if ('oscuro' in component) {
      component.oscuro = this.oscuro;
    }
  }
}
