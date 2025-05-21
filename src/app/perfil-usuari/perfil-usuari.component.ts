import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AutenticacioService } from '../services/autenticacio.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

interface Pedido {
  id: string;
  fecha: Date;
  total: number;
  estado: string;
  productos: { nombre: string; cantidad: number; precio: number }[];
}

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
export class PerfilUsuariComponent implements OnInit, OnDestroy {
  // Change from Input to signal
  oscuro = signal<boolean>(false);
  private themeSubscription: Subscription | null = null;

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
    private autenticacioService: AutenticacioService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatosUsuario();
    this.cargarPedidos();
    this.cargarMetodosPago();
    
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.darkMode$.subscribe(isDark => {
      this.oscuro.set(isDark);
    });
    
    // Initialize with current theme state
    this.oscuro.set(this.themeService.isDarkMode());
  }
  
  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  metodoPagoForm!: FormGroup;
  metodoPagoGuardado = false;
  editandoMetodoPago = false;
  metodoEditandoId: string | null = null;

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

    this.metodoPagoForm = this.fb.group({
      tipo: ['Visa', Validators.required],
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
      this.http.get<any[]>(`${this.apiUrl}/carrito/historial/${this.usuarioActual.id}`).subscribe({
        next: (data) => {
          console.log('Historial de pedidos cargado:', data);
          this.pedidos = data;
        },
        error: (error) => {
          console.error('Error al cargar historial de pedidos:', error);
        }
      });
    }
  }

  calcularTotalPedido(pedido: any): number {
    return pedido.cantidad * pedido.producto.precio;
  }

  cargarMetodosPago(): void {
    if (this.usuarioActual?.id) {
      this.autenticacioService.getMetodosPago(this.usuarioActual.id).subscribe({
        next: (data) => {
          console.log('Métodos de pago cargados:', data);
          if (Array.isArray(data)) {
            this.metodosPago = data;
          } else {
            console.warn('La respuesta no es un array:', data);
            this.metodosPago = [];
          }
        },
        error: (error) => {
          console.error('Error al cargar métodos de pago:', error);
          this.metodosPago = [];
        }
      });
    } else {
      this.metodosPago = [];
    }
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

      this.autenticacioService.actualizarUsuario(this.usuarioActual.id, datosActualizados).subscribe({
        next: (response) => {
          console.log('Perfil actualizado en la base de datos:', response);

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

  passwordChanged = false;

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

  guardarMetodoPago(): void {
    if (this.metodoPagoForm.invalid) {
      Object.keys(this.metodoPagoForm.controls).forEach(key => {
        this.metodoPagoForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.usuarioActual?.id) {
      const metodoPago = this.metodoPagoForm.value;
      console.log('Sending payment method data:', metodoPago);

      if (this.editandoMetodoPago && this.metodoEditandoId) {
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
        const paymentData = {
          ...metodoPago,
          user_id: this.usuarioActual.id.toString()
        };

        console.log('Adding payment method with data:', paymentData);

        this.autenticacioService.addMetodoPago(this.usuarioActual.id, paymentData).subscribe({
          next: (response) => {
            console.log('Método de pago añadido:', response);
            this.metodoPagoGuardado = true;
            setTimeout(() => this.metodoPagoGuardado = false, 3000);
            this.cargarMetodosPago();
            this.resetMetodoPagoForm();
          },
          error: (error) => {
            console.error('Error al añadir método de pago:', error);
            console.error('Error details:', error.error);
            alert(`Error al añadir método de pago: ${error.error?.message || 'Por favor, inténtalo de nuevo.'}`);
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

  eliminarMetodoPago(id: string): void {
    if (this.usuarioActual?.id) {
      this.autenticacioService.deleteMetodoPago(id).subscribe({
        next: () => {
          console.log('Método de pago eliminado correctamente');
          this.metodosPago = this.metodosPago.filter(metodo => metodo.id_metodo !== id);
        },
        error: (error) => {
          console.error('Error al eliminar método de pago:', error);
          this.metodosPago = this.metodosPago.filter(metodo => metodo.id_metodo !== id);
        }
      });
    } else {
      this.metodosPago = this.metodosPago.filter(metodo => metodo.id_metodo !== id);
    }
  }

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
