import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';
import { itemCarrito } from '../../models/item-carrito';
import { DineroPipe } from '../../../../shared/pipes/dinero-pipe';

@Component({
  imports: [DineroPipe],
  selector: 'app-carrito-item',
  styleUrl: './carrito-item.css',
  templateUrl: './carrito-item.html',
})
export class CarritoItem {
  @Input() item!: itemCarrito;
  @Output() eliminarProducto = new EventEmitter<itemCarrito>();


  onEliminarProducto() {
    this.eliminarProducto.emit(this.item)
  }
  subtotal = computed(() => this.item.producto.precio * this.item.cantidad)
}
