import { Component, inject, signal } from '@angular/core';
import { ProductosService } from '../../../../shared/services/productosService';
import { Producto } from '../../../../shared/models/producto';
import { ProductosAdminService } from '../../services/productos-admin-service';
import { TablaProductos } from '../../components/tabla-productos/tabla-productos';

@Component({
  imports: [TablaProductos],
  selector: 'app-productos-admin',
  styleUrl: './productos-admin.css',
  templateUrl: './productos-admin.html',
})
export class ProductosAdmin {
  productosService = inject(ProductosAdminService);
  readonly productos = signal<readonly Producto[]>([]);
  cargando = signal<boolean>(true);
    readonly error = signal<string | null>(null);

  ngOnInit(): void{
    this.productosService.cargarTodosLosProductos().subscribe({
      next: productosRecibidos =>{
        this.productos.set(productosRecibidos);
        this.cargando.set(false);
      },
      error: error =>{
        this.error.set('No se pudieron cargar los productos');
        this.cargando.set(false);
      }
    });
    
  }
}
