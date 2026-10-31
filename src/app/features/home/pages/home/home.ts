import { Component } from '@angular/core';

import { HeroCarousel } from '../../components/hero-carousel/hero-carousel';
import { Beneficios } from '../../components/beneficios/beneficios';

import { CardProduct } from '../../../catalogo/components/card-product/card-product';
import { CatalogoService } from '../../../catalogo/services/catalogo';

import { Producto } from '../../../../shared/models/producto';
import { CarritoService } from '../../../carrito/services/carrito';

@Component({
  imports: [
    HeroCarousel,
    Beneficios,
    CardProduct
  ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly catalogo = inject(CatalogoService);
  private readonly carrito = inject(CarritoService);

  productosDestacados = computed(() =>
    this.catalogo.products().filter(
      producto => producto.destacado
    )
  );

  ngOnInit(): void {
    this.catalogo.cargarProductos();
  }

  onAgregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto);
  }

}
