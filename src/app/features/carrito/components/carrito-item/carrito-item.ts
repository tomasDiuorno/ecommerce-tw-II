import { Component, computed, input, output } from '@angular/core';
import { itemCarrito } from '../../models/item-carrito';
import { DineroPipe } from '../../../../shared/pipes/dinero-pipe';

@Component({
  imports: [DineroPipe],
  selector: 'app-carrito-item',
  styleUrl: './carrito-item.css',
  templateUrl: './carrito-item.html',
})
export class CarritoItem {
  readonly item = input.required<itemCarrito>();
  readonly eliminarProducto = output<itemCarrito>();

  readonly subtotal = computed(() => {
    const item = this.item();
    return item.producto.precio * item.cantidad;
  });

  onEliminarProducto(): void {
    this.eliminarProducto.emit(this.item());
  }
}