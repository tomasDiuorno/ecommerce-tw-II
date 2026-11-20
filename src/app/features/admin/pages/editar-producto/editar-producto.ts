import { Component, OnInit, inject, signal } from '@angular/core';
import {
  apply,
  form,
  FormField,
  required,
  validate,
} from '@angular/forms/signals';
import {
  descripcionProductoSchema,
  nombreProductoSchema,
  precioProductoSchema,
} from '../../forms/producto.schemas';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EditarProductoFormulario } from '../../models/EditarProductoFormulario';
import { CatalogoService } from '../../../catalogo/services/catalogo';
import { ProductosAdminService } from '../../services/productos-admin-service';



@Component({
  selector: 'app-editar-producto',
 imports: [FormField, RouterLink],
  templateUrl: './editar-producto.html',
  styleUrl: './editar-producto.css',
})
export class EditarProducto implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productosService = inject(ProductosAdminService);
  private readonly catalogoService = inject(CatalogoService);

  private readonly productoId = Number(
    this.route.snapshot.paramMap.get('id'),
  );

  private readonly stockProducto = signal(0);

  readonly categorias = this.catalogoService.categorias;
  readonly cargandoProducto = signal(false);

  readonly cargandoCategorias = this.catalogoService.cargando;

  readonly errorProducto = signal<string | null>(null);
  readonly errorCategorias = this.catalogoService.error;
  readonly errorGuardado = signal<string | null>(null);
  readonly guardando = signal(false);

private readonly modelo = signal<EditarProductoFormulario>({
  nombre: '',
  descripcion: '',
  categoriaId: '',
  precio: 0,
  imagen: '',
  disponible: false,
  destacado: false,
});

readonly formulario = form(this.modelo, campos => {
  apply(campos.nombre, nombreProductoSchema);
  apply(campos.descripcion, descripcionProductoSchema);
  apply(campos.precio, precioProductoSchema);

  validate(campos.disponible, ({ value }) => {
    return value() && this.stockProducto() <= 0
      ? { kind: 'sinStock', message: 'No podés activar un producto sin stock. Agregá unidades desde la gestión de stock.' }
      : null;
  });

  required(campos.categoriaId);

  validate(campos.categoriaId, ({ value }) => {
    const id = Number(value());

    return this.categorias().some(categoria => categoria.id === id)
      ? null
      : { kind: 'categoriaInvalida' };
  });
});

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
  if (this.cargandoProducto() || this.guardando()) {
  return;
}

    this.errorProducto.set(null);
    this.errorGuardado.set(null);

    if (
      !Number.isInteger(this.productoId) ||
      this.productoId <= 0 ||
      this.productoId > 2147483647
    ) {
      this.errorProducto.set('El ID del producto no es válido.');
      return;
    }

    this.cargandoProducto.set(true);
    this.catalogoService.cargarCategorias();

    this.productosService.obtenerPorId(this.productoId)
      .pipe(
        finalize(() => this.cargandoProducto.set(false)),
      )
      .subscribe({
        next: producto => {
  this.stockProducto.set(producto.stock);
  this.formulario().reset({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoriaId: String(producto.categoriaId),
    precio: producto.precio,
    imagen: producto.imagen ?? '',
    disponible: producto.disponible,
    destacado: producto.destacado,
  });
},
        error: () => {
          this.errorProducto.set(
            'No se pudo cargar el producto.',
          );
        },
      });
  }

 guardar(evento: Event): void {
  evento.preventDefault();

  if (
    this.guardando() ||
    this.cargandoProducto() ||
    this.cargandoCategorias() ||
    this.errorProducto() ||
    this.errorCategorias()
  ) {
    return;
  }

  this.errorGuardado.set(null);
  this.formulario().markAsTouched();

  if (this.formulario().invalid()) {
    this.errorGuardado.set('Revisá los campos del formulario.');

    const campos = [
      this.formulario.nombre,
      this.formulario.descripcion,
      this.formulario.categoriaId,
      this.formulario.precio,
      this.formulario.disponible,
    ];

    const primerCampoInvalido = campos.find(campo => campo().invalid());
    primerCampoInvalido?.().focusBoundControl();

    return;
  }

  const valores = this.modelo();

  if (valores.precio === null) {
    this.errorGuardado.set('Completá el precio del producto.');
    return;
  }

  const datos = {
    ...valores,
    id: this.productoId,
    categoriaId: Number(valores.categoriaId),
    precio: valores.precio,
    nombre: valores.nombre.trim(),
    descripcion: valores.descripcion.trim(),
    imagen: valores.imagen.trim() || null,
  };

  this.guardando.set(true);

  this.productosService.editarProducto(datos).pipe(
    finalize(() => this.guardando.set(false)),
  ).subscribe({
    next: () => this.cancelar(),
    error: () => {
      this.errorGuardado.set(
        'No se pudo confirmar el guardado. Revisá el listado antes de reintentar.',
      );
    },
  });
}

  cancelar(): void {
    void this.router.navigate(['/admin/productos']);
  }
}
