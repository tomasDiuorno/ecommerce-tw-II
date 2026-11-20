import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../../shared/models/categoria';

@Component({
  imports: [RouterLink],
  selector: 'app-categorias',
  styleUrl: './categorias.css',
  templateUrl: './categorias.html',
})
export class Categorias {
  readonly categorias = input.required<readonly Categoria[]>();

}
