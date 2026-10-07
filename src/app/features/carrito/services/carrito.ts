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
  envio = signal(1000);
  productos = this.items.asReadonly();
  totalCompra = computed(() => this.totalProductos() + this.envio());
  cantidad = computed(() =>
  this.items().reduce((suma, item) => suma + item.cantidad, 0));
  direccion = signal<string | null>(null);

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
      this.items.update((items) => [...items, { producto, cantidad: 1 }]);
    }
    console.log(this.items());
  }

  eliminarProducto(itemAEliminar: itemCarrito): void {
    this.items.update(items => {
      const encontrado = items.find(item => item.producto.id === itemAEliminar.producto.id);
      if(!encontrado){
        return items;
      }

      if(encontrado.cantidad > 1){
        return items.map(item => 
          item.producto.id === itemAEliminar.producto.id ?
          {...item, cantidad : item.cantidad -1} : item
        )
      }

      return items.filter(
        item => item.producto.id !== itemAEliminar.producto.id
      )
    }
    )
  }
  
  establecerDireccion(direccion: string){
    this.direccion.set(direccion);
  }


vaciarCarrito() {
  this.items.set([]);
}
}

function foreach(arg0: boolean): any {
  throw new Error('Function not implemented.');
}
