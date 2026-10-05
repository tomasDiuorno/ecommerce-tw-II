import { Component, Input } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
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

}
