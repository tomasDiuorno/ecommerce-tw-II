import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { form, FormField, max, min, required, validate } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, EMPTY, finalize, map, Subscription, switchMap } from 'rxjs';
import { Producto } from '../../../../shared/models/producto';
import { ProductosAdminService } from '../../services/productos-admin-service';

@Component({
  imports: [CurrencyPipe, NgOptimizedImage, FormField, RouterLink],
  selector: 'app-gestionar-stock',
  styleUrl: './gestionar-stock.css',
  templateUrl: './gestionar-stock.html',
})
export class GestionarStock implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productosService = inject(ProductosAdminService);
  private readonly destroyRef = inject(DestroyRef);
  private operacion?: Subscription;

  readonly producto = signal<Producto | null>(null);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly mensajeExito = signal<string | null>(null);

  private readonly modeloStock = signal<{ cantidad: number | null }>({ cantidad: null });

  readonly formularioStock = form(this.modeloStock, campos => {
    required(campos.cantidad);
    min(campos.cantidad, 1);
    max(campos.cantidad, Number.MAX_SAFE_INTEGER);
    validate(campos.cantidad, ({ value }) => {
      const cantidad = value();
      return cantidad === null || Number.isSafeInteger(cantidad)
        ? null
        : { kind: 'cantidadInvalida' };
    });
  });
  ngOnInit(): void {
  const parametro = this.route.snapshot.paramMap.get('id');
  const id = Number(parametro);

  if (
    !parametro ||
    !/^\d+$/.test(parametro) ||
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    this.error.set('El identificador del producto no es válido.');
    this.cargando.set(false);
    return;
  }

  this.productosService.obtenerPorId(id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.cargando.set(false)), //Es como un finally
    )
    .subscribe({
      next: producto => {
        this.producto.set(producto);
      },
      error: (error: unknown) => {
        this.error.set(
          this.mensajeError(error, 'No se pudo cargar el producto.'),
        );
      },
    });
}

  agregarStock(evento?: Event): void {
    evento?.preventDefault();
    this.actualizarStock('agregar');
  }

  quitarStock(): void {
    this.actualizarStock('quitar');
  }

  private actualizarStock(tipo: 'agregar' | 'quitar'): void {
    const producto = this.producto();
    if (this.guardando() || this.cargando() || !producto) return;

    this.error.set(null);
    this.mensajeExito.set(null);
    this.formularioStock().markAsTouched();
    const cantidad = this.formularioStock.cantidad().value();
    if (this.formularioStock().invalid() || cantidad === null || !Number.isSafeInteger(cantidad) || cantidad <= 0) return;

    if (tipo === 'quitar' && cantidad > producto.stock) {
      this.error.set('La cantidad a quitar supera el stock disponible.');
      return;
    }

    this.guardando.set(true);
    let actualizado = false;
    const peticion = tipo === 'agregar'
      ? this.productosService.agregarStock(producto.id, cantidad)
      : this.productosService.quitarStock(producto.id, cantidad);

    this.operacion = peticion.pipe(
      switchMap(() => {
        actualizado = true;
        this.formularioStock().reset({ cantidad: null });
        return this.productosService.obtenerPorId(producto.id);
      }),
      finalize(() => this.guardando.set(false)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({ //El switchMap retorna el observable (suscrito internamente por el mismo switchMap) antes de que se ejecute el next
      next: productoActualizado => {
        this.producto.set(productoActualizado);
        this.mensajeExito.set(tipo === 'agregar'
          ? 'Stock agregado correctamente. El estado de activación se mantuvo sin cambios.'
          : productoActualizado.stock === 0
            ? 'Stock actualizado. El producto se desactivó porque no quedan unidades.'
            : 'Stock descontado correctamente.');
      },
      error: (error: unknown) => {
        if (actualizado) {
          this.producto.set(null);
          this.error.set('El stock se actualizó, pero no pudimos cargar los datos nuevos. Volvé al listado para consultarlos; no repitas la operación.');
          return;
        }
        this.error.set(this.mensajeError(error, 'No se pudo confirmar la actualización. Consultá el stock desde el listado antes de volver a intentarlo.'));
      },
    });
  }

  private mensajeError(error: unknown, alternativa: string): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400: return 'Los datos enviados no son válidos. Revisá la cantidad ingresada.';
        case 404: return 'El producto no existe o ya no está disponible para gestionar.';
        case 409: return 'El stock disponible cambió o es insuficiente. Volvé al listado para consultar las existencias actuales.';
      }
    }
    return alternativa;
  }
}
