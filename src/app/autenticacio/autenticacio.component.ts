import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AutenticacioService } from '../services/autenticacio.service';
import { Usuari } from '../intarfaces/Usuari.interface';

@Component({
  selector: 'app-autenticacio',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './autenticacio.component.html',
  styleUrl: './autenticacio.component.css'
})
export class AutenticacioComponent implements OnInit {
  loginForm!: FormGroup;
  registroForm!: FormGroup;
  errorMessage: string = '';
  mostrarRegistro: boolean = false;

  constructor(
    private router: Router,
    private autenticacioService: AutenticacioService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registroForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
      rol: ['usuari', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmarPassword')?.value
      ? null
      : { 'mismatch': true };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { correo, password } = this.loginForm.value;
      if (this.autenticacioService.validarUsuari(correo, password)) {
        this.router.navigate(['/productes']);
      } else {
        this.errorMessage = 'Credenciales incorrectas';
      }
    }
  }

  onRegistro() {
    if (this.registroForm.valid) {
      const { nom, correo, password, rol } = this.registroForm.value;
      const usuari: Usuari = { nom, correo, password, rol };

      if (this.autenticacioService.registrarUsuari(usuari)) {
        this.router.navigate(['/productes']);
      } else {
        this.errorMessage = 'El correo ya está registrado';
      }
    }
  }

  toggleFormulario() {
    this.mostrarRegistro = !this.mostrarRegistro;
    this.errorMessage = '';
    this.loginForm.reset();
    this.registroForm.reset();
  }

  get loginControls() {
    return this.loginForm.controls;
  }

  get registroControls() {
    return this.registroForm.controls;
  }
}
