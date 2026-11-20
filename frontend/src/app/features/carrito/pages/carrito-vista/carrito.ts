
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  catchError, debounceTime, distinctUntilChanged,
  finalize, map, of, Subject, switchMap, tap,
} from 'rxjs';

import { CarritoService } from '../../services/carrito';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoResumen } from '../../components/carrito-resumen/carrito-resumen';
import { DireccionesService, DireccionSugerida } from '../../services/direcciones';
import { itemCarrito } from '../../models/item-carrito';

@Component({
  imports: [CarritoItem, CarritoResumen, RouterLink],
  selector: 'app-carrito',
  styleUrl: './carrito.css',
  templateUrl: './carrito.html',
})
export class Carrito {
  protected readonly carritoService = inject(CarritoService);
  private readonly direccionesService = inject(DireccionesService);
  private readonly router = inject(Router);

  protected readonly resultadosActuales = signal<DireccionSugerida[]>([]);
  protected readonly buscandoDireccion = signal(false);
  protected readonly errorDireccion = signal<string | null>(null);
  protected readonly direccionElegida = linkedSignal(() => this.carritoService.direccion());

  private readonly busquedasDireccion = new Subject<string>();

  constructor() {
    this.busquedasDireccion
      .pipe(
        map(texto => texto.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.errorDireccion.set(null)),
        switchMap(termino => {
          if (termino.length < 3) {
            return of<DireccionSugerida[]>([]);
          }

          this.buscandoDireccion.set(true);

          return this.direccionesService.buscar(termino).pipe(
            catchError(() => {
              this.errorDireccion.set('No se pudieron buscar direcciones. Intentá nuevamente.');
              return of<DireccionSugerida[]>([]);
            }),
            finalize(() => this.buscandoDireccion.set(false)),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe(resultados => this.resultadosActuales.set(resultados));
  }

  buscarDireccion(direccion: string): void {
    this.busquedasDireccion.next(direccion);
  }

  guardarDireccion(nuevaDireccion: string | null): void {
    if (nuevaDireccion) {
      this.carritoService.establecerDireccion(nuevaDireccion);
    }
  }

  eliminarProducto(item: itemCarrito): void {
    this.carritoService.eliminarProducto(item);
  }

  // Navegar a la pantalla de facturación
  realizarPedido(): void {
    this.router.navigate(['/checkout']);
  }
}
