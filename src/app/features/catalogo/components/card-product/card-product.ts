import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';

@Component({
  imports: [],
  selector: 'app-card-product',
  styleUrl: './card-product.css',
  templateUrl: './card-product.html',
})
export class CardProduct {
  @Input() producto!: Producto;
  @Output() agregarAlCarrito = new EventEmitter<Producto>();

  onAgregarAlCarrito(){
    this.agregarAlCarrito.emit(this.producto);
  }
}
