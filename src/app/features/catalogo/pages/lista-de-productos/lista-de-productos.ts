import { Component, inject, OnInit, signal } from '@angular/core';
import { Productos } from '../../../../models/productos';
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
  productos = signal<Productos[]>([])

  constructor(
    private catalogo: CatalogoService,
    private carrito: CarritoService
  ) {}

  ngOnInit(): void {
    this.catalogo.getProductos().subscribe(products => {
      this.productos.set(products);
    });
  }

  onAgregarAlCarrito(producto: Productos) {
    this.carrito.agregarProducto(producto);
  }

  onToggleDisponible(productId: number) {
    this.productos.update(products => {
      return products.map(p => {
        if (p.id === productId) {
          return { ...p, disponible: !p.disponible };
        }
        return p;
      });
    });
  }
}
