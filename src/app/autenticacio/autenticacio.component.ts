import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AutenticacioService } from '../services/autenticacio.service';
import { Usuari } from '../intarfaces/Usuari.interface';

@Component({
  selector: 'app-autenticacio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './autenticacio.component.html',
  styleUrl: './autenticacio.component.css'
})
export class AutenticacioComponent implements OnInit {
  loginForm!: FormGroup;
  registroForm!: FormGroup;
  errorMessage: string = '';
  mostrarRegistro: boolean = false;
  mostrarPassword: boolean = false;
  mostrarPasswordRegistro: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private autenticacioService: AutenticacioService,
    private fb: FormBuilder
  ) {}

  // Update the ngOnInit method to ensure the 'nick' control is properly defined
  ngOnInit() {
    this.loginForm = this.fb.group({
      nick: ['', [Validators.required, Validators.minLength(3)]], // Make sure this line exists
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registroForm = this.fb.group({
      nick: ['', [Validators.required, Validators.minLength(3)]], // Make sure this line exists
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
      rol: ['usuari', [Validators.required]],
      terminos: [false, [Validators.requiredTrue]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmarPassword')?.value
      ? null
      : { 'mismatch': true };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { nick, password } = this.loginForm.value; // Changed from correo to nick
      
      this.autenticacioService.validarUsuari(nick, password).subscribe({
        next: (isValid) => {
          this.loading = false;
          if (isValid) {
            this.router.navigate(['menu']);
          } else {
            this.errorMessage = 'Credenciales incorrectas';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error al iniciar sesión: ' + (error.error?.message || error.message);
        }
      });
    }
  }
  
  onRegistro() {
    if (this.registroForm.valid) {
      this.loading = true;
      const { nom, correo, password, rol } = this.registroForm.value;
      const usuari: Usuari = { 
        nick:nom, 
        email: correo,
        password, 
        rol 
      };

      this.autenticacioService.registrarUsuari(usuari).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.router.navigate(['menu']);
          } else {
            this.errorMessage = 'El correo ya está registrado';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error al registrar: ' + error.message;
        }
      });
    }
  }

  toggleFormulario() {
    this.mostrarRegistro = !this.mostrarRegistro;
    this.errorMessage = '';
    this.loginForm.reset();
    this.registroForm.reset();
    
    // Reset default values
    if (this.mostrarRegistro) {
      this.registroForm.patchValue({
        rol: 'usuari'
      });
    }
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  togglePasswordVisibilityRegistro() {
    this.mostrarPasswordRegistro = !this.mostrarPasswordRegistro;
  }

  get loginControls() {
    return this.loginForm.controls;
  }

  get registroControls() {
    return this.registroForm.controls;
  }
}
