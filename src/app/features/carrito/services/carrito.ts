import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { EnvioService, type CotizacionEnvio } from './envio';
import { Producto } from '../../../shared/models/producto';
import { itemCarrito } from '../models/item-carrito';


const CLAVE_CARRITO = 'carrito';

function cargarItemsGuardados(): itemCarrito[] {

  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    if (!guardado) {
      return [];
    }

    const items = JSON.parse(guardado);
    if (!Array.isArray(items)) {
      return [];
    }

    return items.filter(item =>
      item &&
      item.producto &&
      item.producto.id != null &&
      Number.isFinite(item.producto.precio) &&
      Number.isInteger(item.cantidad) &&
      item.cantidad > 0
    );
  } 
  catch {
    return [];
  }

}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private items = signal<itemCarrito[]>(cargarItemsGuardados());

  private readonly envioService = inject(EnvioService);

  // Productos del carrito
  readonly productos = this.items.asReadonly();

  // Cantidad total de productos
  readonly cantidad = computed(() => 
    this.items().reduce((suma, item) => suma + item.cantidad,0)
  );

  // Precio de productos
  readonly totalProductos = computed(() =>
    this.items().reduce((suma, item) => suma + item.producto.precio * item.cantidad,0)
  );
  
  // Datos del envío
  /*Se agrega calculo de envio desde el backend*/
  readonly codigoPostal = signal('');
  readonly direccion = signal<string | null>(null);

  readonly cotizacion = signal<CotizacionEnvio | null>(null);

  readonly calculandoEnvio = signal(false);
  readonly errorEnvio = signal<string | null>(null);
  readonly envio = computed(() => this.cotizacion()?.envio ?? 0 );

  readonly totalCompra = computed(() => this.cotizacion()?.total ?? this.totalProductos());

 constructor() {

    // Guardar automáticamente el carrito.
    effect(() => {
      try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(this.items()));
      } 
      catch (error) {
        console.error('No se pudo guardar el carrito:', error);
      }
    });

    // Calcular el envío cuando cambian los datos.
    effect((onCleanup) => {
      const productos = this.productos();
      const direccion = this.direccion();
      const codigoPostal = this.codigoPostal().trim();

      this.cotizacion.set(null);
      this.errorEnvio.set(null);
      this.calculandoEnvio.set(false);

      if (productos.length === 0 || !direccion?.trim() || !codigoPostal) {
        return;
      }

      this.calculandoEnvio.set(true);

      const suscripcion = this.envioService.cotizar({
        direccion,
        codigoPostal,
        items: productos.map(item => ({
          productoId: item.producto.id,
          cantidad: item.cantidad
        }))

      }).subscribe({
        next: cotizacion => {
          this.cotizacion.set(cotizacion);
          this.calculandoEnvio.set(false);
        },
        error: () => {
          this.errorEnvio.set('No se pudo calcular el envío. Revisá el código postal y la conexión con el servidor.');
          this.calculandoEnvio.set(false);
        }
      });
      onCleanup(() => suscripcion.unsubscribe());
    });
  }

  // Agregar productos
  agregarProducto(producto: Producto, cantidad = 1): void {

    if (!producto || !Number.isInteger(cantidad) || cantidad <= 0 ) {
      return;
    }

    this.items.update(items => {

      const existente = items.find( item => item.producto.id === producto.id );

      if (existente) {
        return items.map(item =>
          item.producto.id === producto.id ? {
            ...item,
            cantidad: item.cantidad + cantidad
          } : item
        );
      }
      return [...items,{producto, cantidad}];
    });
  }

  // Quitar una unidad o eliminar el producto
  eliminarProducto(itemAEliminar: itemCarrito): void {

    this.items.update(items => {

      const encontrado = items.find(item => item.producto.id === itemAEliminar.producto.id);

      if (!encontrado) {
        return items;
      }

      if (encontrado.cantidad > 1) {
        return items.map(item =>
          item.producto.id === itemAEliminar.producto.id ? {
            ...item,
            cantidad: item.cantidad - 1
          } : item
        );
      }
      return items.filter(item => item.producto.id !== itemAEliminar.producto.id);
    });
  }

  // Establecer dirección
  establecerDireccion(direccion: string): void {
    this.direccion.set(direccion);
  }

  // Vaciar carrito manualmente
  vaciarCarrito(): void {
    this.items.set([]);
  }

}