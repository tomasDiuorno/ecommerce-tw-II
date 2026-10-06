import { Component, Input, signal } from '@angular/core';
import { DineroPipe } from '../../../../shared/pipes/dinero-pipe';

@Component({
  imports: [DineroPipe],
  selector: 'app-carrito-resumen',
  styleUrl: './carrito-resumen.css',
  templateUrl: './carrito-resumen.html',
})
export class CarritoResumen {
  @Input() totalProductos!: number;
  @Input() envio!: number;
  @Input() totalCompra!: number;


  mostrarDireccion = signal(false);
  DireccionSeleccionada = signal<string | null>(null); 

  toggleDireccion() {
    this.mostrarDireccion.update(estado => !estado);
  }

  seleccionarDireccion(direccion: string) {
    this.DireccionSeleccionada.set(direccion);
    this.mostrarDireccion.set(false);      
  }
}
