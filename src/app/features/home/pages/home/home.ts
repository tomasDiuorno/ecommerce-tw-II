import { Component, computed, inject, OnInit } from '@angular/core';

import { HeroCarousel } from '../../components/hero-carousel/hero-carousel';
import { Beneficios } from '../../components/beneficios/beneficios';

import { CatalogoService } from '../../../catalogo/services/catalogo';

import { Producto } from '../../../../shared/models/producto';
import { CarritoService } from '../../../carrito/services/carrito';
import { Destacados } from '../../components/destacados/destacados';
import { Categorias } from '../../components/categorias/categorias';
import { ProductosService } from '../../../../shared/services/productosService';

@Component({
  imports: [
    HeroCarousel,
    Beneficios,
    Destacados,
    Categorias
],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly productosServices = inject(ProductosService);
  private readonly catalogo = inject(CatalogoService);
  private readonly carrito = inject(CarritoService);


  categorias = this.catalogo.categorias;
  

  onAgregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto);
  }



}
