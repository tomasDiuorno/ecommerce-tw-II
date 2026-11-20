import { Component, effect, input, model, signal } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DineroPipe } from '../../../../shared/pipes/dinero-pipe';
import { DireccionSugerida } from '../../services/direcciones';

@Component({
  imports: [DineroPipe, ReactiveFormsModule],
  selector: 'app-carrito-resumen',
  styleUrl: './carrito-resumen.css',
  templateUrl: './carrito-resumen.html',
})
export class CarritoResumen {
  readonly totalProductos = input.required<number>();
  readonly envio = input.required<number>();
  readonly totalCompra = input.required<number>();
  readonly resultadoBusqueda = input<DireccionSugerida[]>([]);
  readonly calculandoEnvio = input(false);
  readonly errorEnvio = input<string | null>(null);
  readonly tieneCotizacion = input(false);
  readonly carritoVacio = input(true);

  readonly codigoPostal = model('');
  readonly direccionSeleccionada = model<string | null>(null);

  protected readonly mostrarDireccion = signal(false);
  protected readonly codigoPostalControl = new FormControl('', { nonNullable: true });
  protected readonly buscadorControl = new FormControl('', { nonNullable: true });

  // Cada cambio del buscador se emite al padre;
  readonly direccionABuscar = outputFromObservable(this.buscadorControl.valueChanges);

  constructor() {
    // Mantiene el input del formulario alineado con el valor que viene del padre.
    effect(() =>
      this.codigoPostalControl.setValue(this.codigoPostal(), { emitEvent: false }),
    );
  }

  aplicarCodigoPostal(): void {
    this.codigoPostal.set(this.codigoPostalControl.value.trim().toUpperCase());
  }

  toggleDireccion(): void {
    this.mostrarDireccion.update(estado => !estado);

    if (!this.mostrarDireccion()) {
      this.buscadorControl.setValue(''); // ya notifica al padre
    }
  }

  seleccionarDireccion(sugerida: DireccionSugerida): void {
  this.direccionSeleccionada.set(sugerida.direccion);
  this.codigoPostal.set(sugerida.codigoPostal?.trim().toUpperCase() ?? '');
  this.mostrarDireccion.set(false);
  this.buscadorControl.setValue('');
}
}