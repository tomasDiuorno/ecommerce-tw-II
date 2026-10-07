import { Component, effect, inject, signal } from '@angular/core';
import { CarritoService } from '../../services/carrito';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoResumen } from '../../components/carrito-resumen/carrito-resumen';
import { DireccionesService, DireccionSugerida } from '../../services/direcciones';
import { itemCarrito } from '../../models/item-carrito';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CarritoItem, CarritoResumen, RouterLink],
  selector: 'app-carrito',
  styleUrl: './carrito.css',
  templateUrl: './carrito.html',
})
export class Carrito {
  carritoService = inject(CarritoService);
  direccionesService = inject(DireccionesService)
  resultadosActuales = signal<DireccionSugerida[]>([])
  direccionElegida = signal<string | null>(this.carritoService.direccion());

guardarDireccion(nuevaDireccion: string | null) {
    if (nuevaDireccion) {
      this.carritoService.establecerDireccion(nuevaDireccion);
    }
  }

  eliminarProducto(item: itemCarrito){
    this.carritoService.eliminarProducto(item);
  }

  buscarDireccion(direccion: string){
    if(!direccion){
      this.resultadosActuales.set([]);
      return;
    }
    this.direccionesService.buscar(direccion).subscribe((resultado) =>
      this.resultadosActuales.set(resultado)
    )
  }


}
