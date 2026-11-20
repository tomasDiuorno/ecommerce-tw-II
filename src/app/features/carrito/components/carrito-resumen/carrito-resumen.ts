
import { Component, input, signal, output, model, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { DineroPipe } from '../../../../shared/pipes/dinero-pipe';
import { DireccionSugerida } from '../../services/direcciones';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth';

@Component({
  imports: [DineroPipe, ReactiveFormsModule],
  selector: 'app-carrito-resumen',
  styleUrl: './carrito-resumen.css',
  templateUrl: './carrito-resumen.html',
})
export class CarritoResumen {
  authService = inject(AuthService);
  private router = inject(Router);

  totalProductos = input.required<number>();
  envio = input.required<number>();
  totalCompra = input.required<number>();
  resultadoBusqueda = input<DireccionSugerida[]>([]);
  codigoPostal = model('');
  calculandoEnvio = input(false);
  errorEnvio = input<string | null>(null);
  tieneCotizacion = input(false);
  carritoVacio = input(true);

  codigoPostalControl = new FormControl('', { nonNullable: true });

  mostrarDireccion = signal(false);
  direccionSeleccionada = model<string | null>(null);

  direccionABuscar = output<string>();

  buscadorControl = new FormControl('');

  constructor() {
    this.buscadorControl.valueChanges
      .pipe(
        filter(valor => (valor ?? '').length > 2),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(termino => {
        this.direccionABuscar.emit(termino ?? '');
      });
  }

  confirmarPedido(): void {
    if (this.carritoVacio()) {
      return;
    }

    if (!this.authService.estaLogueado()) {
      this.router.navigate(
        ['/signin'],
        { queryParams: { returnUrl: '/carrito' } }
      );
      return;
    }

    // Acá continúa el proceso de confirmación
    // si el usuario ya está autenticado.
  }

  aplicarCodigoPostal(): void {
    const codigo = this.codigoPostalControl.value.trim().toUpperCase();
    this.codigoPostal.set(codigo);
  }

  toggleDireccion(): void {
    this.mostrarDireccion.update(estado => !estado);

    if (!this.mostrarDireccion()) {
      this.buscadorControl.setValue('');
      this.direccionABuscar.emit('');
    }
  }

  seleccionarDireccion(direccion: string): void {
    this.direccionSeleccionada.set(direccion);
    this.mostrarDireccion.set(false);
    this.buscadorControl.setValue('');
    this.direccionABuscar.emit('');
  }
}
