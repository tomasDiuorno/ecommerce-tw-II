import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CatalogoService } from '../../services/catalogo';
import { CarritoService } from '../../../carrito/services/carrito';
import { Producto } from '../../../../shared/models/producto';

@Component({
  selector: 'app-detalle-producto',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './detalle-producto.html',
})
export class DetalleProducto implements OnInit {
  private route = inject(ActivatedRoute);
  private catalogo = inject(CatalogoService);
  private carrito = inject(CarritoService);

  private id = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id')))),
    { initialValue: NaN }
  );

  readonly producto = computed(() => this.catalogo.obtenerPorId(this.id()));
  readonly cantidad = signal(1);

  ngOnInit(): void {
    this.catalogo.cargarProductos();
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
