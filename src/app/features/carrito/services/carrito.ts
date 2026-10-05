import { computed, Injectable, signal } from '@angular/core';
import { Producto } from '../../../shared/models/producto';
import { itemCarrito } from '../models/item-carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private items = signal<itemCarrito[]>([]);
    
  totalProductos = computed(() =>
    this.items().reduce(
      (suma, item) => suma + item.producto.precio * item.cantidad,
      0
    )
  );
  envio = 1000;
  productos = this.items.asReadonly();
  totalCompra = this.totalProductos() + this.envio;

  cantidad = computed(() => this.items().length);
  

  agregarProducto(producto: Producto) {
    const itemExistente = this.items().find(item => item.producto.id == producto.id)
   if (itemExistente) {
  this.items.update(items =>
    items.map(item =>
      item.producto.id === itemExistente.producto.id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    )
  );
} else {
 this.items.update((items) => [...items, {producto, cantidad: 1}]);
}
console.log(this.items());
  }
  
  eliminarProducto(producto: Producto) {
    this.items.update((productos) => productos.filter((item) => item.producto.id !== producto.id));
  }

  vaciarCarrito() {
    this.items.set([]);
  }



}