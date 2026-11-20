import { ChangeDetectorRef, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ProductosService } from '../../../../shared/services/productosService';
import { Producto } from '../../../../shared/models/producto';
import { ProductosAdminService } from '../../services/productos-admin-service';
import { TablaProductos } from '../../components/tabla-productos/tabla-productos';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  imports: [TablaProductos, RouterLink],
  selector: 'app-productos-admin',
  styleUrl: './productos-admin.css',
  templateUrl: './productos-admin.html',
})
export class ProductosAdmin {
  productosService = inject(ProductosAdminService);
  readonly productos = signal<readonly Producto[]>([]);
  cargando = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly eliminandoId = signal<number | null>(null);
  readonly errorEliminacion = signal<string | null>(null);
  readonly mensajeEliminacion = signal('');
  private readonly tituloProductos = viewChild.required<ElementRef<HTMLHeadingElement>>('tituloProductos');

  readonly productoAEliminar = signal<Producto | null>(null);
  private readonly detectorCambios = inject(ChangeDetectorRef);
  private readonly dialogoEliminar = viewChild.required<ElementRef<HTMLDialogElement>>('dialogoEliminar');

  ngOnInit(): void {
    this.productosService.cargarTodosLosProductos().subscribe({
      next: productosRecibidos => {
        this.productos.set(productosRecibidos);
        this.cargando.set(false);
      },
      error: error => {
        this.error.set('No se pudieron cargar los productos');
        this.cargando.set(false);
      }
    });
  }

  eliminarProducto(producto: Producto): void {
  if (this.eliminandoId() !== null || this.productoAEliminar() !== null) {
    return;
  }

  this.productoAEliminar.set(producto);
  this.detectorCambios.detectChanges();
  this.dialogoEliminar().nativeElement.showModal();
}

cancelarEliminacion(evento?: Event): void {
  evento?.preventDefault();
  this.dialogoEliminar().nativeElement.close();
  this.productoAEliminar.set(null);
}

confirmarEliminacion(): void {
  const producto = this.productoAEliminar();

  if (producto === null || this.eliminandoId() !== null) {
    return;
  }

  this.cancelarEliminacion();

  this.errorEliminacion.set(null);
  this.mensajeEliminacion.set('');
  this.eliminandoId.set(producto.id);

  this.productosService.eliminarProducto(producto.id)
    .pipe(finalize(() => this.eliminandoId.set(null)),)
    .subscribe({next: () => {this.productos.update(productos => productos
    .filter(item => item.id !== producto.id),);

        this.mensajeEliminacion.set(`Se eliminó "${producto.nombre}".`,);
        this.tituloProductos().nativeElement.focus();
      },
      error: () => {this.errorEliminacion.set('No se pudo confirmar la eliminación. Recargá el listado para verificar el estado del producto.', );
      },
    });
}

}
