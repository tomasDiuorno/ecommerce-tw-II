// catalogo.ts (service)
import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../../shared/models/producto';

@Injectable({ providedIn: 'root' })
export class CatalogoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/productos';

  private productsSignal = signal<Producto[]>([]);

  readonly products = this.productsSignal.asReadonly();


  readonly categorias = computed(() =>
    [...new Set(this.products().map(p => p.categoria))]
  );

  cargarProductos(): void {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (productos) => {
        this.productsSignal.set(productos);
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  alternarDisponibilidad(productId: number): void {
  this.productsSignal.update(products =>
    products.map(p =>
      p.id === productId ? { ...p, disponible: !p.disponible } : p
    )
  );
}
}
