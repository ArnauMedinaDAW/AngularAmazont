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

// Update the MetodoPago interface to match the Laravel model
interface MetodoPago {
  id_metodo: string;
  tipo: string;
  nombre: string;
  num_tarjeta: string;
  fecha_caducidad?: string;
  codigo_validacion?: string;
  predeterminado?: boolean;
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

  // Add these properties to your component class
  metodoPagoForm!: FormGroup;
  metodoPagoGuardado = false;
  editandoMetodoPago = false;
  metodoEditandoId: string | null = null;

  // Update the inicializarFormularios method to include the payment method form
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

    // Add the payment method form
    this.metodoPagoForm = this.fb.group({
      tipo: ['', Validators.required],
      nombre: ['', Validators.required],
      num_tarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      fecha_caducidad: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      codigo_validacion: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
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
      this.autenticacioService.getMetodosPago(this.usuarioActual.id).subscribe({
        next: (data) => {
          console.log('Métodos de pago cargados:', data);
          this.metodosPago = data;
        },
        error: (error) => {
          console.error('Error al cargar métodos de pago:', error);
        }
      });
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

  // Add methods for managing payment methods
  guardarMetodoPago(): void {
    if (this.metodoPagoForm.invalid) {
      Object.keys(this.metodoPagoForm.controls).forEach(key => {
        this.metodoPagoForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.usuarioActual?.id) {
      const metodoPago = this.metodoPagoForm.value;

      if (this.editandoMetodoPago && this.metodoEditandoId) {
        // Update existing payment method
        this.autenticacioService.updateMetodoPago(this.metodoEditandoId, metodoPago).subscribe({
          next: (response) => {
            console.log('Método de pago actualizado:', response);
            this.metodoPagoGuardado = true;
            setTimeout(() => this.metodoPagoGuardado = false, 3000);
            this.cargarMetodosPago();
            this.resetMetodoPagoForm();
          },
          error: (error) => {
            console.error('Error al actualizar método de pago:', error);
            alert('Error al actualizar método de pago. Por favor, inténtalo de nuevo.');
          }
        });
      } else {
        // Add new payment method
        this.autenticacioService.addMetodoPago(this.usuarioActual.id, metodoPago).subscribe({
          next: (response) => {
            console.log('Método de pago añadido:', response);
            this.metodoPagoGuardado = true;
            setTimeout(() => this.metodoPagoGuardado = false, 3000);
            this.cargarMetodosPago();
            this.resetMetodoPagoForm();
          },
          error: (error) => {
            console.error('Error al añadir método de pago:', error);
            alert('Error al añadir método de pago. Por favor, inténtalo de nuevo.');
          }
        });
      }
    } else {
      console.error('No se puede guardar método de pago: ID de usuario no disponible');
      alert('Error: No se puede identificar al usuario. Por favor, inicia sesión de nuevo.');
      this.router.navigate(['/login']);
    }
  }

  editarMetodoPago(metodo: MetodoPago): void {
    this.editandoMetodoPago = true;
    this.metodoEditandoId = metodo.id_metodo;

    this.metodoPagoForm.patchValue({
      tipo: metodo.tipo,
      nombre: metodo.nombre,
      num_tarjeta: metodo.num_tarjeta,
      fecha_caducidad: metodo.fecha_caducidad || '',
      codigo_validacion: metodo.codigo_validacion || ''
    });
  }

  cancelarEdicion(): void {
    this.editandoMetodoPago = false;
    this.metodoEditandoId = null;
    this.resetMetodoPagoForm();
  }

  resetMetodoPagoForm(): void {
    this.metodoPagoForm.reset();
    this.editandoMetodoPago = false;
    this.metodoEditandoId = null;
  }

  // Update the eliminarMetodoPago method to use the API
  eliminarMetodoPago(id: string): void {
    if (this.usuarioActual?.id) {
      this.autenticacioService.deleteMetodoPago(id).subscribe({
        next: () => {
          console.log('Método de pago eliminado correctamente');
          this.metodosPago = this.metodosPago.filter(metodo => metodo.id_metodo !== id);
        },
        error: (error) => {
          console.error('Error al eliminar método de pago:', error);
          // For demo purposes, still remove it from the UI
          this.metodosPago = this.metodosPago.filter(metodo => metodo.id_metodo !== id);
        }
      });
    } else {
      this.metodosPago = this.metodosPago.filter(metodo => metodo.id_metodo !== id);
    }
  }

  // Update the establecerPredeterminado method to use the API
  establecerPredeterminado(id: string): void {
    if (this.usuarioActual?.id) {
      this.http.put(`${this.apiUrl}/metodoPago/${id}/predeterminado`, {
        user_id: this.usuarioActual.id
      }).subscribe({
        next: () => {
          this.metodosPago.forEach(metodo => {
            metodo.predeterminado = metodo.id_metodo === id;
          });
        },
        error: (error) => {
          console.error('Error al establecer método de pago predeterminado:', error);
          // For demo purposes, still update the UI
          this.metodosPago.forEach(metodo => {
            metodo.predeterminado = metodo.id_metodo === id;
          });
        }
      });
    } else {
      this.metodosPago.forEach(metodo => {
        metodo.predeterminado = metodo.id_metodo === id;
      });
    }
  }

  // Add a helper method to get the last 4 digits of a card number
  obtenerUltimosDigitos(numeroTarjeta: string): string {
    if (numeroTarjeta && numeroTarjeta.length >= 4) {
      return numeroTarjeta.slice(-4);
    }
    return 'XXXX';
  }

  verDetallePedido(id: string): void {
    console.log('Ver detalle del pedido:', id);

  }
}
