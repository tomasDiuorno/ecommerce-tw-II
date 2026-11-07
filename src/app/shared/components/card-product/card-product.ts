import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../models/producto';

@Component({
  imports: [CurrencyPipe, RouterLink],
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
