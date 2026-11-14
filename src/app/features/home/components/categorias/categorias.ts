import { Component, input } from '@angular/core';
import { Categoria } from '../../../../shared/models/categoria';

@Component({
  imports: [],
  selector: 'app-categorias',
  styleUrl: './categorias.css',
  templateUrl: './categorias.html',
})
export class Categorias {
  readonly categorias = input.required<readonly Categoria[]>();

}
