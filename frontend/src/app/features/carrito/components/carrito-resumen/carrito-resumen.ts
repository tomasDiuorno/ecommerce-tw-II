
import { Component, input, linkedSignal, model, output, signal } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';

import { DineroPipe } from '../../../../shared/pipes/dinero-pipe';
import { DireccionSugerida } from '../../services/direcciones';

@Component({
  imports: [DineroPipe, FormField],
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
  private readonly modeloBusqueda = signal({ texto: '' });
  private readonly modeloCodigoPostal = linkedSignal(() => ({
    texto: this.codigoPostal()
  }));

  protected readonly formularioBusqueda = form(this.modeloBusqueda);
  protected readonly formularioCodigoPostal = form(this.modeloCodigoPostal);

  // Comunica el texto de búsqueda al componente padre
  readonly direccionABuscar = outputFromObservable(
    toObservable(this.formularioBusqueda.texto().value),
  );

  // Avisa al componente padre cuando se presiona "Realizar pedido"
  readonly confirmarPedido = output<void>();

  aplicarCodigoPostal(): void {
    this.codigoPostal.set(
      this.formularioCodigoPostal.texto().value().trim().toUpperCase()
    );
  }

  toggleDireccion(): void {
    this.mostrarDireccion.update(estado => !estado);

    if (!this.mostrarDireccion()) {
      this.formularioBusqueda().reset({ texto: '' });
    }
  }

  seleccionarDireccion(sugerida: DireccionSugerida): void {
    this.direccionSeleccionada.set(sugerida.direccion);
    this.codigoPostal.set(
      sugerida.codigoPostal?.trim().toUpperCase() ?? ''
    );
    this.mostrarDireccion.set(false);
    this.formularioBusqueda().reset({ texto: '' });
  }
}
