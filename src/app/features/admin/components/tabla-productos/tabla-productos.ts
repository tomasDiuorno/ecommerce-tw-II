import { Component, input } from '@angular/core';
import { Producto } from '../../../../shared/models/producto';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-tabla-productos',
  styleUrl: './tabla-productos.css',
  templateUrl: './tabla-productos.html',
})
export class TablaProductos {
  readonly productos = input.required<readonly Producto[]>();
}
