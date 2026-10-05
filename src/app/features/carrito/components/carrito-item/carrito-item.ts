import { Component, Input } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';
import { itemCarrito } from '../../models/item-carrito';

@Component({
  imports: [],
  selector: 'app-carrito-item',
  styleUrl: './carrito-item.css',
  templateUrl: './carrito-item.html',
})
export class CarritoItem {
  @Input() item!: itemCarrito;
}
