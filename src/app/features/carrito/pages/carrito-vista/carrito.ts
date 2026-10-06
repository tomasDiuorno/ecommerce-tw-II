import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoResumen } from '../../components/carrito-resumen/carrito-resumen';
import { Producto } from '../../../../shared/models/producto';
import { itemCarrito } from '../../models/item-carrito';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CarritoItem, CarritoResumen, RouterLink],
  selector: 'app-carrito',
  styleUrl: './carrito.css',
  templateUrl: './carrito.html',
})
export class Carrito {
  carritoService = inject(CarritoService);

  eliminarProducto(item: itemCarrito){
    this.carritoService.eliminarProducto(item);
  }
}
