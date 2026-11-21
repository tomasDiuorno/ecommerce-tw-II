
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { CompraService } from '../../services/compra';
import { CarritoService } from '../../../carrito/services/carrito';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
})
export class Checkout {

  private readonly compraService = inject(CompraService);
  private readonly carritoService = inject(CarritoService);
  private readonly router = inject(Router);

  procesandoCompra = signal(false);
  errorCompra = signal<string | null>(null);

  formulario = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    apellido: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    dni: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{7,8}$/)
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    tarjeta: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{16}$/)
    ]),

    vencimiento: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)
    ]),

    seguridad: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{3}$/)
    ])
  });

  confirmarCompra() {
    if (this.formulario.invalid || this.procesandoCompra()) {
      this.formulario.markAllAsTouched();
      return;
    }

    const productos = this.carritoService.productos();
    const direccion = this.carritoService.direccion();
    const codigoPostal = this.carritoService.codigoPostal();
    const cotizacion = this.carritoService.cotizacion();

    if (
      productos.length === 0 ||
      !direccion?.trim() ||
      !codigoPostal.trim() ||
      !cotizacion
    ) {
      this.errorCompra.set(
        'El carrito está vacío o faltan datos para calcular el envío.'
      );
      return;
    }

    this.errorCompra.set(null);
    this.procesandoCompra.set(true);

    const solicitud = {
      direccion,
      codigoPostal,
      metodoPago: 'online' as const,
      items: productos.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad
      }))
    };

    this.compraService.realizarCompra(solicitud).subscribe({
      next: respuesta => {
        console.log('Compra registrada:', respuesta);
        this.carritoService.vaciarCarrito();
        this.errorCompra.set(null);
        this.procesandoCompra.set(false);
        this.router.navigate(['/compra-exitosa'], {
          state: {
            compra: respuesta.compra
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorCompra.set(
          error.error?.mensaje ||
          'No se pudo realizar la compra. Intentá nuevamente.'
        );
        this.procesandoCompra.set(false);
      }
    });
  }
}
