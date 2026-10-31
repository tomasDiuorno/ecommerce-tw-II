import { Component, inject, OnInit, signal } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';
import { CatalogoService } from '../../services/catalogo';
import { CardProduct } from '../../components/card-product/card-product';
import { CarritoService } from '../../../carrito/services/carrito';

@Component({
  imports: [CardProduct],
  selector: 'app-lista-de-productos',
  styleUrl: './lista-de-productos.css',
  templateUrl: './lista-de-productos.html',
})
export class ListaDeProductos implements OnInit {

  private readonly catalogo = inject(CatalogoService);
  private readonly carrito = inject(CarritoService);

  productos = this.catalogo.products;


  ngOnInit(): void {
    this.catalogo.cargarProductos();
  }

  onAgregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto);
  }

  onToggleDisponible(productId: number): void {
    this.catalogo.alternarDisponibilidad(productId);
  }
}
