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
  protected readonly busqueda = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const categoria = params.get('categoria');
        const busqueda = params.get('busqueda');
        this.busqueda.set(busqueda);
        this.productos.set([]);
        this.error.set(null);
        this.cargando.set(true);

        return this.productosService.cargarProductos(
          categoria ? Number(categoria) : undefined,
          busqueda || undefined,
        ).pipe(
          catchError(() => {
            this.error.set('No se pudieron cargar los productos.');
            this.cargando.set(false);
            return EMPTY;
          }),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(productos => {
      this.productos.set(productos);
      this.cargando.set(false);
    });
  }
  onAgregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto);
  }

}
