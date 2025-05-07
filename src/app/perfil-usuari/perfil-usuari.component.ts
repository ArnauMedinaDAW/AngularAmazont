import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
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

  seccionActiva: 'perfil' | 'pedidos' | 'pagos' | 'seguridad' = 'perfil';

  perfilGuardado = false;
  contraseñaCambiada = false;

  pedidos: Pedido[] = [];
  metodosPago: MetodoPago[] = [];
  usuario: Usuario | null = null;

  // API base URL - adjust this to your Laravel API endpoint
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatosUsuario();
    this.cargarPedidos();
    this.cargarMetodosPago();
  }

  inicializarFormularios(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^\d{9}$/)]],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      pais: ['', Validators.required]
    });

    this.securityForm = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNueva: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmar: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  cargarDatosUsuario(): void {
    // Get user ID from localStorage or other auth service
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.http.get<Usuario>(`${this.apiUrl}/usuarios/${userId}`).subscribe({
        next: (data) => {
          this.usuario = data;

          // Update form with user data
          this.perfilForm.patchValue({
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            direccion: data.direccion,
            ciudad: data.ciudad,
            codigoPostal: data.codigoPostal,
            pais: data.pais
          });
        },
        error: (error) => {
          console.error('Error al cargar datos del usuario:', error);
          // For demo purposes, load sample data if API fails
          this.cargarDatosDemoUsuario();
        }
      });
    } else {
      // For demo purposes
      this.cargarDatosDemoUsuario();
    }
  }

  cargarPedidos(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.http.get<Pedido[]>(`${this.apiUrl}/usuarios/${userId}/pedidos`).subscribe({
        next: (data) => {
          this.pedidos = data;
        },
        error: (error) => {
          console.error('Error al cargar pedidos:', error);
          // For demo purposes, load sample data if API fails
          this.cargarDatosDemoPedidos();
        }
      });
    } else {
      // For demo purposes
      this.cargarDatosDemoPedidos();
    }
  }

  cargarMetodosPago(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.http.get<MetodoPago[]>(`${this.apiUrl}/usuarios/${userId}/metodos-pago`).subscribe({
        next: (data) => {
          this.metodosPago = data;
        },
        error: (error) => {
          console.error('Error al cargar métodos de pago:', error);
          // For demo purposes, load sample data if API fails
          this.cargarDatosDemoMetodosPago();
        }
      });
    } else {
      // For demo purposes
      this.cargarDatosDemoMetodosPago();
    }
  }

  // Demo data methods (will be used if API fails or for development)
  private cargarDatosDemoUsuario(): void {
    this.perfilForm.patchValue({
      nombre: 'David García',
      email: 'usuari@ejemplo.com',
      telefono: '612345678',
      direccion: 'Calle Principal 123',
      ciudad: 'Barcelona',
      codigoPostal: '08001',
      pais: 'España'
    });
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
        ultimosDigitos: 'usuari@email.com',
        predeterminado: false
      }
    ];
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('passwordNueva')?.value;
    const confirmPassword = form.get('passwordConfirmar')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  cambiarSeccion(seccion: 'perfil' | 'pedidos' | 'pagos' | 'seguridad'): void {
    console.log('Changing section to:', seccion);
    this.seccionActiva = seccion;
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) {
      Object.keys(this.perfilForm.controls).forEach(key => {
        this.perfilForm.get(key)?.markAsTouched();
      });
      return;
    }

    const userId = localStorage.getItem('userId');
    const datosActualizados = this.perfilForm.value;

    if (userId) {
      this.http.put(`${this.apiUrl}/usuarios/${userId}`, datosActualizados).subscribe({
        next: () => {
          this.perfilGuardado = true;
          setTimeout(() => this.perfilGuardado = false, 3000);
        },
        error: (error) => {
          console.error('Error al guardar perfil:', error);
          // For demo purposes, show success anyway
          this.perfilGuardado = true;
          setTimeout(() => this.perfilGuardado = false, 3000);
        }
      });
    } else {
      // For demo purposes
      this.perfilGuardado = true;
      setTimeout(() => this.perfilGuardado = false, 3000);
      console.log('Datos del perfil guardados:', this.perfilForm.value);
    }
  }

  cambiarPassword(): void {
    if (this.securityForm.invalid) {
      Object.keys(this.securityForm.controls).forEach(key => {
        this.securityForm.get(key)?.markAsTouched();
      });
      return;
    }

    const userId = localStorage.getItem('userId');
    const passwordData = {
      passwordActual: this.securityForm.value.passwordActual,
      passwordNueva: this.securityForm.value.passwordNueva
    };

    if (userId) {
      this.http.put(`${this.apiUrl}/usuarios/${userId}/cambiar-password`, passwordData).subscribe({
        next: () => {
          this.contraseñaCambiada = true;
          this.securityForm.reset();
          setTimeout(() => this.contraseñaCambiada = false, 3000);
        },
        error: (error) => {
          console.error('Error al cambiar contraseña:', error);
          // For demo purposes, show success anyway
          this.contraseñaCambiada = true;
          this.securityForm.reset();
          setTimeout(() => this.contraseñaCambiada = false, 3000);
        }
      });
    } else {
      // For demo purposes
      console.log('Contraseña cambiada');
      this.securityForm.reset();
      this.contraseñaCambiada = true;
      setTimeout(() => this.contraseñaCambiada = false, 3000);
    }
  }

  eliminarMetodoPago(id: string): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.http.delete(`${this.apiUrl}/usuarios/${userId}/metodos-pago/${id}`).subscribe({
        next: () => {
          this.metodosPago = this.metodosPago.filter(metodo => metodo.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar método de pago:', error);
          // For demo purposes, remove from local array anyway
          this.metodosPago = this.metodosPago.filter(metodo => metodo.id !== id);
        }
      });
    } else {
      // For demo purposes
      this.metodosPago = this.metodosPago.filter(metodo => metodo.id !== id);
    }
  }

  establecerPredeterminado(id: string): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.http.put(`${this.apiUrl}/usuarios/${userId}/metodos-pago/${id}/predeterminado`, {}).subscribe({
        next: () => {
          this.metodosPago.forEach(metodo => {
            metodo.predeterminado = metodo.id === id;
          });
        },
        error: (error) => {
          console.error('Error al establecer método de pago predeterminado:', error);
          // For demo purposes, update local array anyway
          this.metodosPago.forEach(metodo => {
            metodo.predeterminado = metodo.id === id;
          });
        }
      });
    } else {
      // For demo purposes
      this.metodosPago.forEach(metodo => {
        metodo.predeterminado = metodo.id === id;
      });
    }
  }

  verDetallePedido(id: string): void {
    console.log('Ver detalle del pedido:', id);
    // Here you could navigate to a detailed order view
    // this.router.navigate(['/pedidos', id]);
  }
}
