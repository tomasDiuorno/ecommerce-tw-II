import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, EMPTY, finalize, map, switchMap } from 'rxjs';

import { CarritoService } from '../../../carrito/services/carrito';
import { Producto } from '../../../../shared/models/producto';
import { ProductosService } from '../../../../shared/services/productosService';

@Component({
  selector: 'app-detalle-producto',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
})
export class DetalleProducto implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productosService = inject(ProductosService);
  private readonly carrito = inject(CarritoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly producto = signal<Producto | undefined>(undefined);
  readonly cantidad = signal(1);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      distinctUntilChanged(),
      switchMap(parametro => {
        this.producto.set(undefined);
        this.cantidad.set(1);
        this.error.set(null);
        this.cargando.set(false);

        const id = Number(parametro);

        if (
          !parametro ||
          !/^\d+$/.test(parametro) ||
          !Number.isSafeInteger(id) ||
          id <= 0 ||
          id > 2147483647
        ) {
          this.error.set('El ID del producto no es válido.');
          return EMPTY;
        }

        this.cargando.set(true);

        return this.productosService.obtenerPorId(id).pipe(
          catchError((error: unknown) => {
            if (!(error instanceof HttpErrorResponse && error.status === 404)) {
              this.error.set('No se pudo cargar el producto.');
            }

            return EMPTY;
          }),
          finalize(() => this.cargando.set(false)),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(producto => {
      this.producto.set(producto);
    });
  }

  aumentar(): void {
    this.cantidad.update(cantidad => cantidad + 1);
  }

  disminuir(): void {
    this.cantidad.update(cantidad => Math.max(1, cantidad - 1));
  }

  agregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto, this.cantidad());
    this.cantidad.set(1);
  }
}