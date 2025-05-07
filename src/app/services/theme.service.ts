import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {
    // Initialize from localStorage if available
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      this.setDarkMode(true);
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    localStorage.setItem('darkMode', isDark.toString());
    
    // Update body class for global CSS
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkMode());
  }
}