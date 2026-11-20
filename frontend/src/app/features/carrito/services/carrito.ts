import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { EnvioService, type CotizacionEnvio } from './envio';
import { Producto } from '../../../shared/models/producto';
import { itemCarrito } from '../models/item-carrito';


const CLAVE_CARRITO = 'carrito';

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function esEnteroPositivo(valor: unknown): valor is number {
  return (
    typeof valor === 'number' &&
    Number.isSafeInteger(valor) &&
    valor > 0
  );
}

function esProducto(valor: unknown): valor is Producto {
  if (!esObjeto(valor)) {
    return false;
  }

  const precio = valor['precio'];
  const stock = valor['stock'];

  return (
    esEnteroPositivo(valor['id']) &&
    typeof valor['nombre'] === 'string' &&
    typeof valor['descripcion'] === 'string' &&
    typeof valor['categoria'] === 'string' &&
    esEnteroPositivo(valor['categoriaId']) &&
    typeof precio === 'number' &&
    Number.isFinite(precio) &&
    precio >= 0 &&
    (valor['imagen'] === null || typeof valor['imagen'] === 'string') &&
    typeof stock === 'number' &&
    Number.isSafeInteger(stock) &&
    stock >= 0 &&
    typeof valor['disponible'] === 'boolean' &&
    typeof valor['destacado'] === 'boolean'
  );
}

function esItemCarrito(valor: unknown): valor is itemCarrito {
  return (
    esObjeto(valor) &&
    esProducto(valor['producto']) &&
    esEnteroPositivo(valor['cantidad'])
  );
}

function cargarItemsGuardados(): itemCarrito[] {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);

    if (guardado === null) {
      return [];
    }

    const datos: unknown = JSON.parse(guardado);

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos.filter(esItemCarrito);
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private items = signal<itemCarrito[]>(cargarItemsGuardados());

  totalProductos = computed(() =>
    this.items().reduce(
      (suma, item) => suma + item.producto.precio * item.cantidad,
      0
    )
  );
  
  /*Se agrega calculo de envio desde el backend*/
  private readonly envioService = inject(EnvioService);

  readonly codigoPostal = signal('');
  readonly cotizacion = signal<CotizacionEnvio | null>(null);
  readonly calculandoEnvio = signal(false);
  readonly errorEnvio = signal<string | null>(null);

  readonly envio = computed(() => this.cotizacion()?.envio ?? 0);

  readonly totalCompra = computed(() => this.cotizacion()?.total ?? this.totalProductos(),);
  productos = this.items.asReadonly();
  /*FIN calculo de envio desde el backend*/

  cantidad = computed(() =>
    this.items().reduce((suma, item) => suma + item.cantidad, 0));
  direccion = signal<string | null>(null);

  constructor() {
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
        direccion, codigoPostal, items:
          productos.map(item => ({ productoId: item.producto.id, cantidad: item.cantidad, })),
      }).subscribe({
        next: cotizacion => {
          this.cotizacion.set(cotizacion);
          this.calculandoEnvio.set(false);
        },
        error: () => {
          this.errorEnvio.set('No se pudo calcular el envío. Revisá el código postal y la conexión con el servidor.',);
          this.calculandoEnvio.set(false);
        },
      });

      onCleanup(() => suscripcion.unsubscribe());
    });

    effect(() => {
      try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(this.items()));
      } catch {
        
      }
    });
  }

  agregarProducto(producto: Producto, cantidad = 1) {
    const itemExistente = this.items().find(item => item.producto.id == producto.id)
    if (itemExistente) {
      this.items.update(items =>
        items.map(item =>
          item.producto.id === itemExistente.producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      this.items.update((items) => [...items, { producto, cantidad }]);
    }
    console.log(this.items());
  }

  eliminarProducto(itemAEliminar: itemCarrito): void {
    this.items.update(items => {
      const encontrado = items.find(item => item.producto.id === itemAEliminar.producto.id);
      if (!encontrado) {
        return items;
      }

      if (encontrado.cantidad > 1) {
        return items.map(item =>
          item.producto.id === itemAEliminar.producto.id ?
            { ...item, cantidad: item.cantidad - 1 } : item
        )
      }

      return items.filter(
        item => item.producto.id !== itemAEliminar.producto.id
      )
    }
    )
  }

  establecerDireccion(direccion: string) {
    this.direccion.set(direccion);
  }


  vaciarCarrito() {
    this.items.set([]);
  }
}