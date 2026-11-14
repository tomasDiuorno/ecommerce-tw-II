import { Component, input, output } from '@angular/core';
import { CardProduct } from '../../../../shared/components/card-product/card-product';
import { Producto } from '../../../../shared/models/producto';

@Component({
  imports: [CardProduct],
  selector: 'app-destacados',
  styleUrl: './destacados.css',
  templateUrl: './destacados.html',
})
export class Destacados {
  readonly productosDestacados = input.required<readonly Producto[]>();
  readonly agregarAlCarrito = output<Producto>();
}
