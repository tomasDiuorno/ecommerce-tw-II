import { Component, inject, signal  } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { OnInit } from '@angular/core';
import { CatalogoService } from '../../../catalogo/services/catalogo';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductosAdminService } from '../../services/productos-admin-service';

@Component({
  selector: 'app-crear-producto',
  imports: [ReactiveFormsModule],
  templateUrl: './crear-producto.html',
  styleUrl: './crear-producto.css',
})

export class CrearProducto implements OnInit {
  private readonly fb = inject(FormBuilder);

private readonly productosAdminService = inject(ProductosAdminService);
private readonly router = inject(Router);

readonly guardando = signal(false);
readonly errorGuardado = signal<string | null>(null);
private readonly catalogoService = inject(CatalogoService);

readonly categorias = this.catalogoService.categorias;
readonly cargandoCategorias = this.catalogoService.cargando;
readonly errorCategorias = this.catalogoService.error;

readonly formulario = this.fb.nonNullable.group({
    nombre: ['',[ Validators.required, Validators.pattern(/\S/), Validators.maxLength(150),],],
    descripcion: ['',[Validators.required, Validators.pattern(/\S/)],],
    categoriaId: [0,[Validators.required, Validators.min(1)],],
    precio: [0,[Validators.required, Validators.min(0), Validators.max(99999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/),],],
    imagen: [''],
    stock: [0,[Validators.required, Validators.min(0), Validators.max(2147483647), Validators.pattern(/^\d+$/),],],
    disponible: [true],
    destacado: [false],
  });

  ngOnInit(): void {this.catalogoService.cargarCategorias()}

    guardar(): void {
    if (this.guardando()) {
        return;
    }

    this.errorGuardado.set(null);

        if (this.cargandoCategorias() || this.errorCategorias() !== null || this.categorias().length === 0) {
        this.errorGuardado.set('Necesitás tener categorías disponibles para crear el producto.',);
        return;
        }

    if (this.formulario.invalid) {
        this.formulario.markAllAsTouched();
        this.errorGuardado.set('Revisá los campos del formulario.');
        return;
    }

    const valores = this.formulario.getRawValue();

    const datos = { 
        ...valores,
        nombre: valores.nombre.trim(),
        descripcion: valores.descripcion.trim(),
        imagen: valores.imagen.trim() || null,
    };

    this.guardando.set(true);

    this.productosAdminService.crearProducto(datos)
        .pipe(finalize(() => this.guardando.set(false)),)
        .subscribe({next: () => {void this.router.navigate(['/admin/productos']);},
            error: () => {this.errorGuardado.set('No se pudo completar la solicitud. Revisá el listado antes de reintentar.',);
            },
        });
    }
}
