import { Component, input, signal, output, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { DineroPipe } from '../../../../shared/pipes/dinero-pipe';
import { DireccionSugerida } from '../../services/direcciones';


@Component({
  imports: [DineroPipe, ReactiveFormsModule],
  selector: 'app-carrito-resumen',
  styleUrl: './carrito-resumen.css',
  templateUrl: './carrito-resumen.html',
})
export class CarritoResumen {
  totalProductos =  input.required<number>();
  envio = input.required<number>();
  totalCompra = input.required<number>();
  resultadoBusqueda = input<DireccionSugerida[]>([]);


  mostrarDireccion = signal(false);
  direccionSeleccionada = model<string | null>(null);

  direccionABuscar = output<string>(); 

  buscadorControl = new FormControl(''); // El control del input de texto

  constructor() {
    // Escuchamos lo que el usuario escribe, pero le ponemos un "freno" (Debounce)
    this.buscadorControl.valueChanges
      .pipe(
        filter(valor => (valor ?? '').length > 2), //Solo se llama con mas de 3 letras
        debounceTime(300), //Recien se llama despues de 0,3 seg
        distinctUntilChanged(), //Solo se llama si el texto es distinto
        takeUntilDestroyed() //unsuscribe
      )
      .subscribe(termino => {
        this.direccionABuscar.emit(termino ?? '');
      });
  }

  toggleDireccion() {
    this.mostrarDireccion.update(estado => !estado);
    if (!this.mostrarDireccion()) {
      this.buscadorControl.setValue('');
      this.direccionABuscar.emit(''); 
    }
  }

  seleccionarDireccion(direccion: string) {
    this.direccionSeleccionada.set(direccion); // Esto actualiza automáticamente al padre 
    this.mostrarDireccion.set(false); // Cerramos el menú
    this.buscadorControl.setValue(''); // Limpiamos el buscador
    this.direccionABuscar.emit(''); // Limpiamos los resultados
  }
}
