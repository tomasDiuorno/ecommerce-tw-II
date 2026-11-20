import { Component, ElementRef, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CatalogoService } from '../../../catalogo/services/catalogo';
import { ProductosAdminService } from '../../services/productos-admin-service';

@Component({
  selector: 'app-editar-producto',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './editar-producto.html',
  styleUrl: './editar-producto.css',
})
export class EditarProducto implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productosService = inject(ProductosAdminService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly productoId = Number(
    this.route.snapshot.paramMap.get('id'),
  );

  readonly categorias = this.catalogoService.categorias;
  readonly cargandoProducto = signal(false);

  readonly cargandoCategorias = this.catalogoService.cargando;

  readonly errorProducto = signal<string | null>(null);
  readonly errorCategorias = this.catalogoService.error;
  readonly errorGuardado = signal<string | null>(null);
  readonly guardando = signal(false);

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [
      Validators.required,
      Validators.pattern(/\S/),
      Validators.maxLength(150),
    ]],
    descripcion: ['', [
      Validators.required,
      Validators.pattern(/\S/),
    ]],
    categoriaId: [0, [
      Validators.required,
      Validators.min(1),
    ]],
    precio: [0, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999.99),
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]],
    imagen: [''],
    disponible: [false],
    destacado: [false],
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
        next: (producto) => {
          this.formulario.reset({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            categoriaId: producto.categoriaId,
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

  guardar(): void {
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

    const categoriaExiste = this.categorias().some(
      categoria =>
        categoria.id === this.formulario.controls.categoriaId.value,
    );

    if (!categoriaExiste) {
      this.formulario.controls.categoriaId.setErrors({
        categoriaInvalida: true,
      });
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.errorGuardado.set('Revisá los campos del formulario.');

      this.elemento.nativeElement
        .querySelector<HTMLElement>(
          'input.ng-invalid, textarea.ng-invalid, select.ng-invalid',
        )
        ?.focus();

      return;
    }

    const valores = this.formulario.getRawValue();

    const datos = {
      ...valores,
      id: this.productoId,
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim() || null,
    };

    this.guardando.set(true);

    this.productosService.editarProducto(datos)
      .pipe(
        finalize(() => this.guardando.set(false)),
      )
      .subscribe({
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
