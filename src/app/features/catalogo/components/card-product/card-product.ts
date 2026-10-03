import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Productos } from '../../../../models/productos';

@Component({
  imports: [],
  selector: 'app-card-product',
  styleUrl: './card-product.css',
  templateUrl: './card-product.html',
})
export class CardProduct {
  @Input() producto!: Productos;
  @Output() agregarAlCarrito = new EventEmitter<Productos>();

  onAgregarAlCarrito(){
    this.agregarAlCarrito.emit(this.producto);
  }
}
