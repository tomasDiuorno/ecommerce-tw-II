import { DestroyRef, Component, inject, OnInit, signal } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';
import { CardProduct } from '../../../../shared/components/card-product/card-product';
import { CarritoService } from '../../../carrito/services/carrito';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../../../shared/services/productosService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap } from 'rxjs';

@Component({
  imports: [CardProduct],
  selector: 'app-lista-de-productos',
  styleUrl: './lista-de-productos.css',
  templateUrl: './lista-de-productos.html',
})
export class ListaDeProductos implements OnInit {
  private readonly productosService = inject(ProductosService);
  private readonly carrito = inject(CarritoService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly productos = signal<Producto[]>([]);
  readonly error = signal<string | null>(null);
  readonly cargando = signal(true);

  ngOnInit(): void {
  const categoria = this.route.snapshot.queryParamMap.get('categoria');
  const categoriaId = categoria ? Number(categoria) : undefined;

  this.productosService.cargarProductos(categoriaId).subscribe({
    next: productos => {
      this.productos.set(productos);
      this.cargando.set(false);
    },
    error: () => {
      this.error.set('No se pudieron cargar los productos.');
      this.cargando.set(false);
    },
  });
}

  onAgregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto);
  }

}
