// catalogo.ts (service)
import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Producto } from '../../../shared/models/producto';
import { Categoria } from '../../../shared/models/categoria';
import { Categorias } from '../../home/components/categorias/categorias';
@Injectable({ providedIn: 'root' })
export class CatalogoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/productos';
  private categoriaApiUrl = 'http://localhost:3000/api/categorias';

  private productsSignal = signal<Producto[]>([]);
private readonly categoriasSignal = signal<Categoria[]>([]);
readonly categorias = this.categoriasSignal.asReadonly();
  readonly products = this.productsSignal.asReadonly();

  obtenerPorId(id: number): Producto | undefined {
    return this.products().find(producto => producto.id === id);
  }


  cargarCategorias(): void {
    this.http.get<Categoria[]>(this.categoriaApiUrl).subscribe({
      next: (categorias) => {
        this.categoriasSignal.set(categorias);
      },
      error: (error) => {
        console.log("No se puedieron cargar las categorias", error);
      }
      });
    }

  cargarProductos(categoriaId?: number): void {
  let params = new HttpParams();
  if (categoriaId !== undefined) {
    params = params.set('categoria', categoriaId);
  }

  this.http.get<Producto[]>(this.apiUrl, { params }).subscribe({
    next: (productos) => this.productsSignal.set(productos),
    error: (error) => console.error('Error al obtener los productos:', error),
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
