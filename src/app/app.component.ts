import { Component } from '@angular/core';
import { Router ,RouterOutlet, RouterLink} from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Amazont';
  
  oscuro = false;
  componentActual: any = null;

  // constructor(private router: Router) {
  //   this.router.navigate(['/productes'], { state: { isFromCategories: false } });
  // }

  canviarTema() {
    this.oscuro = !this.oscuro;

    if (this.componentActual && 'oscuro' in this.componentActual) {
      this.componentActual.oscuro = this.oscuro;
    }

    const botoSwitch = document.getElementById('themeSwitch');
    if (this.oscuro) {
      botoSwitch?.classList.add('active');
    } else {
      botoSwitch?.classList.remove('active');
    }
  }

  onActivate(component: any) {
    this.componentActual = component;

    if ('oscuro' in component) {
      component.oscuro = this.oscuro;
    }
  }
  
}