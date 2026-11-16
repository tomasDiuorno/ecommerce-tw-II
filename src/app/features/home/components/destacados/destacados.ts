import { Component, inject, input, OnInit, output } from '@angular/core';
import { CardProduct } from '../../../../shared/components/card-product/card-product';
import { Producto } from '../../../../shared/models/producto';
import { DestacadosService } from '../../services/destacados-service';

@Component({
  imports: [CardProduct],
  selector: 'app-destacados',
  styleUrl: './destacados.css',
  templateUrl: './destacados.html',
})
export class Destacados implements OnInit {

  readonly destacadosService = inject(DestacadosService);
  readonly productosDestacados = this.destacadosService.productosDestacados;
  readonly agregarAlCarrito = output<Producto>();

  ngOnInit(): void{
    this.destacadosService.cargarProductosDestacados();
  }
}
