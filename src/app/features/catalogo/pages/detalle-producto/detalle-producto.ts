import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CatalogoService } from '../../services/catalogo';
import { CarritoService } from '../../../carrito/services/carrito';
import { Producto } from '../../../../shared/models/producto';
import { ProductosService } from '../../../../shared/services/productosService';

@Component({
  selector: 'app-detalle-producto',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './detalle-producto.html',
})
export class DetalleProducto implements OnInit {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private carrito = inject(CarritoService);

  private id = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id')))),
    { initialValue: NaN }
  );

  readonly producto = signal<Producto | undefined>(undefined);
  readonly cantidad = signal(1);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

 ngOnInit(): void{
    this.productosService.obtenerPorId(this.id()).subscribe({
      next: productoRecibidos =>{
        this.producto.set(productoRecibidos);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        if (!(error instanceof HttpErrorResponse && error.status === 404)) {
          this.error.set('No se pudo cargar el producto.');
        }
        this.cargando.set(false);
      }
    });
    
  }

  aumentar() {
    this.cantidad.update(c => c + 1);
  }

  disminuir() {
    this.cantidad.update(c => Math.max(1, c - 1));
  }

  agregarAlCarrito(producto: Producto) {
    this.carrito.agregarProducto(producto, this.cantidad());
    this.cantidad.set(1);
  }
}
