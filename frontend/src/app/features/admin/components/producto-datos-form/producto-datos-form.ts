import { Component, input } from '@angular/core';
import { FormField, type FieldTree } from '@angular/forms/signals';
import { Categoria } from '../../../../shared/models/categoria';

interface CamposProducto {
  readonly nombre: FieldTree<string, string>;
  readonly descripcion: FieldTree<string, string>;
  readonly categoriaId: FieldTree<string, string>;
  readonly precio: FieldTree<number | null, string>;
  readonly imagen: FieldTree<string, string>;
}

@Component({
  selector: 'app-producto-datos-form',
  imports: [FormField],
  templateUrl: './producto-datos-form.html',
  styleUrl: './producto-datos-form.css',
})
export class ProductoDatosForm {
  readonly campos = input.required<CamposProducto>();
  readonly categorias = input.required<readonly Categoria[]>();
  readonly prefijoId = input.required<string>();
  readonly guardando = input(false);

  readonly ayudaImagen = input(
    'Ingresá una URL o una ruta de imagen del sitio. Podés dejarla vacía.',
  );
}