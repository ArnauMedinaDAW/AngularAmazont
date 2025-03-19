import { Component } from '@angular/core';
import { Router ,RouterOutlet, RouterLink} from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-menu-inici',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass],
  templateUrl: './menu-inici.component.html',
  styleUrl: './menu-inici.component.css'
})
export class MenuIniciComponent {
  title = 'Amazont';

  oscuro = false;
  componentActual: any = null;


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
