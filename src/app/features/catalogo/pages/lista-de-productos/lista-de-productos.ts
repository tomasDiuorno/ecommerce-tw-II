import { Component, inject, OnInit, signal } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';
import { CatalogoService } from '../../services/catalogo';
import { CardProduct } from '../../../../shared/components/card-product/card-product';
import { CarritoService } from '../../../carrito/services/carrito';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [CardProduct],
  selector: 'app-lista-de-productos',
  styleUrl: './lista-de-productos.css',
  templateUrl: './lista-de-productos.html',
})
export class ListaDeProductos implements OnInit {

  private readonly catalogo = inject(CatalogoService);
  private readonly carrito = inject(CarritoService);
  private readonly route = inject(ActivatedRoute);

  productos = this.catalogo.products;


  ngOnInit(): void {
  this.route.queryParamMap.subscribe((params) => {
    const categoria = params.get('categoria');
    this.catalogo.cargarProductos(categoria ? Number(categoria) : undefined);
  });
}

  onAgregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto);
  }

  onToggleDisponible(productId: number): void {
    this.catalogo.alternarDisponibilidad(productId);
  }
}
