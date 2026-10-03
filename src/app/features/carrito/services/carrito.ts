import { computed, Injectable, Service, signal } from '@angular/core';
import { Productos } from '../../../models/productos';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private items = signal<Productos[]>([]);

  productos = this.items.asReadonly();

  cantidad = computed(() => this.items().length);
  total = computed(() => this.items().reduce((suma, item) => suma + item.precio, 0));

  agregarProducto(producto: Productos) {
    console.log('Agregando producto al carrito:', producto);
    this.items.update((productos) => [...productos, producto]);
    console.log('Carrito actualizado:', this.items());
  }
  
  eliminarProducto(producto: Productos) {
    this.items.update((productos) => productos.filter((item) => item.id !== producto.id));
  }

  vaciarCarrito() {
    this.items.set([]);
  }

}