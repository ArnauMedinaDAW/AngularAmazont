import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutenticacioService } from '../services/autenticacio.service';
import { Usuari } from '../intarfaces/Usuari.interface';

@Component({
  selector: 'app-autenticacio',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './autenticacio.component.html',
  styleUrl: './autenticacio.component.css'
})
export class AutenticacioComponent {
  usuari: Usuari = {
    correo: '',
    password: ''
  };
  errorMessage: string = '';
  mostrarRegistro: boolean = false;
  confirmarPassword: string = '';

  constructor(
    private router: Router,
    private autenticacioService: AutenticacioService
  ) {}

  onSubmit() {
    if (this.autenticacioService.validarUsuari(this.usuari.correo, this.usuari.password)) {
      this.router.navigate(['/productes']);
    } else {
      this.errorMessage = 'Credenciales incorrectas';
    }
  }

  onRegistro() {
    if (this.usuari.password !== this.confirmarPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.autenticacioService.registrarUsuari(this.usuari)) {
      this.router.navigate(['/productes']);
    } else {
      this.errorMessage = 'El correo ya está registrado';
    }
  }

  toggleFormulario() {
    this.mostrarRegistro = !this.mostrarRegistro;
    this.errorMessage = '';
    this.usuari = { correo: '', password: '' };
    this.confirmarPassword = '';
  }
}
