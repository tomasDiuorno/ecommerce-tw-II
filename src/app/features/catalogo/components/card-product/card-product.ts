import { Component, input, output } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';

@Component({
  imports: [],
  selector: 'app-card-product',
  styleUrl: './card-product.css',
  templateUrl: './card-product.html',
})
export class CardProduct {
  readonly producto = input.required<Producto>();
readonly agregarAlCarrito = output<Producto>();

  onAgregarAlCarrito(){
    this.agregarAlCarrito.emit(this.producto());
  }
}
