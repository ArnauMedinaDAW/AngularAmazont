import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, CartItem } from '../services/carrito.service';

@Component({
  selector: 'app-proces-pagament',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proces-pagament.component.html',
  styleUrl: './proces-pagament.component.css'
})
export class ProcesPagamentComponent implements OnInit {
  paymentForm!: FormGroup;
  cartItems: CartItem[] = [];
  total: number = 0;
  shippingCost: number = 0;
  paymentMethods = ['Tarjeta de crédito', 'PayPal', 'Transferencia bancaria'];
  selectedPaymentMethod: string = 'Tarjeta de crédito';
  showCreditCardForm: boolean = true;
  processingPayment: boolean = false;
  paymentSuccess: boolean = false;
  
  oscuro = input.required<boolean>();
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private carritoService: CarritoService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cartItems = navigation.extras.state['cartItems'];
      this.total = navigation.extras.state['total'];
      this.shippingCost = navigation.extras.state['shippingCost'];
    } else {
      // If no state, redirect back to cart
      this.router.navigate(['/menu/carrito']);
    }
  }
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.paymentForm = this.fb.group({
      // Shipping address
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      country: ['España', Validators.required],
      
      // Payment method
      paymentMethod: [this.selectedPaymentMethod],
      
      // Credit card details
      cardNumber: ['', [Validators.pattern(/^\d{16}$/)]],
      cardName: [''],
      expiryDate: [''],
      cvv: ['', [Validators.pattern(/^\d{3,4}$/)]],
      
      // Terms
      acceptTerms: [false, Validators.requiredTrue]
    });
    
    // Add conditional validation based on payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.selectedPaymentMethod = method;
      this.showCreditCardForm = method === 'Tarjeta de crédito';
      
      const cardControls = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
      
      if (this.showCreditCardForm) {
        cardControls.forEach(control => {
          this.paymentForm.get(control)?.setValidators([Validators.required]);
        });
      } else {
        cardControls.forEach(control => {
          this.paymentForm.get(control)?.clearValidators();
        });
      }
      
      cardControls.forEach(control => {
        this.paymentForm.get(control)?.updateValueAndValidity();
      });
    });
  }
  
  onSubmit(): void {
    if (this.paymentForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.processingPayment = true;
    
    // Simulate payment processing
    setTimeout(() => {
      this.processingPayment = false;
      this.paymentSuccess = true;
      
      // After 2 seconds, complete the purchase and redirect
      setTimeout(() => {
        this.carritoService.buidarCarret();
        this.router.navigate(['/menu/productes']);
      }, 3000);
    }, 5000);
  }
  
  cancelPayment(): void {
    this.router.navigate(['/menu/carrito']);
  }
}
