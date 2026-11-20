import { Component, inject, OnInit, signal } from '@angular/core';
import {
  apply,
  form,
  FormField,
  max,
  min,
  required,
  validate,
} from '@angular/forms/signals';
import {
  descripcionProductoSchema,
  nombreProductoSchema,
  precioProductoSchema,
} from '../../forms/producto.schemas';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CatalogoService } from '../../../catalogo/services/catalogo';
import { ProductosAdminService } from '../../services/productos-admin-service';

interface ProductoFormulario {
  nombre: string;
  descripcion: string;
  categoriaId: string;
  precio: number | null;
  imagen: string;
  stock: number | null;
  disponible: boolean;
  destacado: boolean;
}

@Component({
  selector: 'app-crear-producto',
  imports: [FormField, RouterLink],
  templateUrl: './crear-producto.html',
  styleUrl: './crear-producto.css',
})
export class CrearProducto implements OnInit {
  private readonly productosAdminService = inject(ProductosAdminService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly router = inject(Router);

  readonly guardando = signal(false);
  readonly errorGuardado = signal<string | null>(null);

  readonly categorias = this.catalogoService.categorias;
  readonly cargandoCategorias = this.catalogoService.cargando;
  readonly errorCategorias = this.catalogoService.error;

  private readonly modelo = signal<ProductoFormulario>({
    nombre: '',
    descripcion: '',
    categoriaId: '',
    precio: 0,
    imagen: '',
    stock: 0,
    disponible: true,
    destacado: false,
  });

  readonly formulario = form(this.modelo, campos => {
  apply(campos.nombre, nombreProductoSchema);
  apply(campos.descripcion, descripcionProductoSchema);
  apply(campos.precio, precioProductoSchema);

  required(campos.categoriaId);

  validate(campos.categoriaId, ({ value }) => {
    const id = Number(value());

    return this.categorias().some(categoria => categoria.id === id)
      ? null
      : { kind: 'categoriaInvalida' };
  });

  required(campos.stock);
  min(campos.stock, 0);
  max(campos.stock, 2147483647);

  validate(campos.stock, ({ value }) => {
    const stock = value();

    if (stock === null) {
      return null;
    }

    return Number.isInteger(stock)
      ? null
      : { kind: 'stockInvalido' };
  });
});

  ngOnInit(): void {
    this.catalogoService.cargarCategorias();
  }

  guardar(evento: Event): void {
    evento.preventDefault();

    if (this.guardando()) {
      return;
    }

    this.errorGuardado.set(null);

    if (
      this.cargandoCategorias() ||
      this.errorCategorias() !== null ||
      this.categorias().length === 0
    ) {
      this.errorGuardado.set(
        'Necesitás tener categorías disponibles para crear el producto.',
      );
      return;
    }

    this.formulario().markAsTouched();

    if (this.formulario().invalid()) {
      this.errorGuardado.set('Revisá los campos del formulario.');
      return;
    }

    const valores = this.modelo();

    // La validación del formulario no estrecha los tipos de TypeScript.
    if (valores.precio === null || valores.stock === null) {
      this.errorGuardado.set('Completá el precio y el stock.');
      return;
    }

    const datos = {
      ...valores,
      categoriaId: Number(valores.categoriaId),
      precio: valores.precio,
      stock: valores.stock,
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim() || null,
    };

    this.guardando.set(true);

    this.productosAdminService.crearProducto(datos).pipe(
      finalize(() => this.guardando.set(false)),
    ).subscribe({
      next: () => {
        void this.router.navigate(['/admin/productos']);
      },
      error: () => {
        this.errorGuardado.set(
          'No se pudo completar la solicitud. Revisá el listado antes de reintentar.',
        );
      },
    });
  }
}