import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito';

@Component({
  imports: [],
  selector: 'app-carrito',
  styleUrl: './carrito.css',
  templateUrl: './carrito.html',
})
export class Carrito {
  constructor(public carritoService: CarritoService) {}
}
