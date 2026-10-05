import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoResumen } from '../../components/carrito-resumen/carrito-resumen';

@Component({
  imports: [CarritoItem, CarritoResumen],
  selector: 'app-carrito',
  styleUrl: './carrito.css',
  templateUrl: './carrito.html',
})
export class Carrito {
  constructor(public carritoService: CarritoService) {}
}
