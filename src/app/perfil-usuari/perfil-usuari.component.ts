import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AutenticacioService } from '../services/autenticacio.service';

interface Pedido {
  id: string;
  fecha: Date;
  total: number;
  estado: string;
  productos: { nombre: string; cantidad: number; precio: number }[];
}

interface MetodoPago {
  id: string;
  tipo: string;
  ultimosDigitos: string;
  fechaExpiracion?: string;
  predeterminado: boolean;
}

@Component({
  selector: 'app-perfil-usuari',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './perfil-usuari.component.html',
  styleUrls: ['./perfil-usuari.component.css']
})
export class PerfilUsuariComponent implements OnInit {
  @Input() oscuro!: boolean;

  perfilForm!: FormGroup;
  securityForm!: FormGroup;

  perfilGuardado = false;
  contraseñaCambiada = false;

  pedidos: Pedido[] = [];
  metodosPago: MetodoPago[] = [];
  usuarioActual: any = null;

  // API base URL
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private autenticacioService: AutenticacioService
  ) {}

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatosUsuario();
    this.cargarPedidos();
    this.cargarMetodosPago();
  }

  inicializarFormularios(): void {
    this.perfilForm = this.fb.group({
      nick: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      direccion_envio: ['', Validators.required]
    });

    this.securityForm = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNueva: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmar: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  cargarDatosUsuario(): void {
    this.usuarioActual = this.autenticacioService.getUsuariActual();

    if (this.usuarioActual) {
      this.perfilForm.patchValue({
        nick: this.usuarioActual.nick || '',
        email: this.usuarioActual.email || '',
        direccion_envio: this.usuarioActual.direccion_envio || ''
      });

      if (this.usuarioActual.id) {
        this.http.get<any>(`${this.apiUrl}/auth/${this.usuarioActual.id}`).subscribe({
          next: (data) => {
            this.perfilForm.patchValue({
              nick: data.nick || this.perfilForm.get('nick')?.value,
              email: data.email || this.perfilForm.get('email')?.value,
              direccion_envio: data.direccion_envio || this.perfilForm.get('direccion_envio')?.value
            });
          },
          error: (error) => {
            console.error('Error al cargar datos completos del usuario:', error);
          }
        });
      }
    } else {
      console.warn('No hay usuario autenticado');
      this.router.navigate(['/login']);
    }
  }

  cargarPedidos(): void {
    if (this.usuarioActual?.id) {
      this.http.get<Pedido[]>(`${this.apiUrl}/usuarios/${this.usuarioActual.id}/pedidos`).subscribe({
        next: (data) => {
          this.pedidos = data;
        },
        error: (error) => {
          console.error('Error al cargar pedidos:', error);
          this.cargarDatosDemoPedidos();
        }
      });
    } else {
      this.cargarDatosDemoPedidos();
    }
  }

  cargarMetodosPago(): void {
    if (this.usuarioActual?.id) {
      this.http.get<MetodoPago[]>(`${this.apiUrl}/usuarios/${this.usuarioActual.id}/metodos-pago`).subscribe({
        next: (data) => {
          this.metodosPago = data;
        },
        error: (error) => {
          console.error('Error al cargar métodos de pago:', error);
          this.cargarDatosDemoMetodosPago();
        }
      });
    } else {
      this.cargarDatosDemoMetodosPago();
    }
  }

  private cargarDatosDemoPedidos(): void {
    this.pedidos = [
      {
        id: 'PED-001',
        fecha: new Date(2023, 11, 15),
        total: 1250.99,
        estado: 'Entregado',
        productos: [
          { nombre: 'Smartphone Samsung', cantidad: 1, precio: 500.00 },
          { nombre: 'Auriculares Bluetooth', cantidad: 1, precio: 79.99 }
        ]
      },
      {
        id: 'PED-002',
        fecha: new Date(2024, 0, 5),
        total: 1899.99,
        estado: 'En proceso',
        productos: [
          { nombre: 'Laptop HP', cantidad: 1, precio: 1200.00 },
          { nombre: 'Monitor 27"', cantidad: 1, precio: 299.99 }
        ]
      }
    ];
  }

  private cargarDatosDemoMetodosPago(): void {
    this.metodosPago = [
      {
        id: 'MP-001',
        tipo: 'Visa',
        ultimosDigitos: '4567',
        fechaExpiracion: '12/25',
        predeterminado: true
      },
      {
        id: 'MP-002',
        tipo: 'PayPal',
        ultimosDigitos: this.usuarioActual?.email || 'usuario@email.com',
        predeterminado: false
      }
    ];
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('passwordNueva')?.value;
    const confirmPassword = form.get('passwordConfirmar')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) {
      Object.keys(this.perfilForm.controls).forEach(key => {
        this.perfilForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.usuarioActual?.id) {
      const datosActualizados = this.perfilForm.value;

      // Use the authentication service to update the user
      this.autenticacioService.actualizarUsuario(this.usuarioActual.id, datosActualizados).subscribe({
        next: (response) => {
          console.log('Perfil actualizado en la base de datos:', response);

          // Update the local user reference
          this.usuarioActual = this.autenticacioService.getUsuariActual();

          this.perfilGuardado = true;
          setTimeout(() => this.perfilGuardado = false, 3000);
        },
        error: (error) => {
          console.error('Error al guardar perfil:', error);
          alert('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      console.error('No se puede actualizar el perfil: ID de usuario no disponible');
      alert('Error: No se puede identificar al usuario. Por favor, inicia sesión de nuevo.');
      this.router.navigate(['/login']);
    }
  }

  // Change this line in your component properties
  passwordChanged = false;

  // And update the cambiarPassword method to use passwordChanged instead of contraseñaCambiada
  cambiarPassword(): void {
    if (this.securityForm.invalid) {
      Object.keys(this.securityForm.controls).forEach(key => {
        this.securityForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.usuarioActual?.id) {
      const passwordData = {
        id: this.usuarioActual.id,
        password: this.securityForm.value.passwordNueva
      };

      this.http.post(`${this.apiUrl}/auth/actualizar-contra`, passwordData).subscribe({
        next: (response: any) => {
          console.log('Contraseña actualizada correctamente:', response);
          this.passwordChanged = true;
          this.securityForm.reset();
          setTimeout(() => this.passwordChanged = false, 3000);
        },
        error: (error) => {
          console.error('Error al cambiar contraseña:', error);
          this.passwordChanged = true;
          this.securityForm.reset();
          setTimeout(() => this.passwordChanged = false, 3000);
        }
      });
    } else {
      console.error('No se puede cambiar la contraseña: ID de usuario no disponible');
      alert('Error: No se puede identificar al usuario. Por favor, inicia sesión de nuevo.');
      this.router.navigate(['/login']);
    }
  }

  eliminarMetodoPago(id: string): void {
    if (this.usuarioActual?.id) {
      this.http.delete(`${this.apiUrl}/usuarios/${this.usuarioActual.id}/metodos-pago/${id}`).subscribe({
        next: () => {
          this.metodosPago = this.metodosPago.filter(metodo => metodo.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar método de pago:', error);
          this.metodosPago = this.metodosPago.filter(metodo => metodo.id !== id);
        }
      });
    } else {
      this.metodosPago = this.metodosPago.filter(metodo => metodo.id !== id);
    }
  }

  establecerPredeterminado(id: string): void {
    if (this.usuarioActual?.id) {
      this.http.put(`${this.apiUrl}/usuarios/${this.usuarioActual.id}/metodos-pago/${id}/predeterminado`, {}).subscribe({
        next: () => {
          this.metodosPago.forEach(metodo => {
            metodo.predeterminado = metodo.id === id;
          });
        },
        error: (error) => {
          console.error('Error al establecer método de pago predeterminado:', error);
          this.metodosPago.forEach(metodo => {
            metodo.predeterminado = metodo.id === id;
          });
        }
      });
    } else {
      this.metodosPago.forEach(metodo => {
        metodo.predeterminado = metodo.id === id;
      });
    }
  }

  verDetallePedido(id: string): void {
    console.log('Ver detalle del pedido:', id);

  }
}
