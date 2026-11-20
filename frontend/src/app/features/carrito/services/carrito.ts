import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
import { EnvioService, type CotizacionEnvio } from './envio';
import { Producto } from '../../../shared/models/producto';
import { itemCarrito } from '../models/item-carrito';

const PREFIJO_CARRITO = 'carrito';
const CLAVE_INVITADO = `${PREFIJO_CARRITO}_invitado`;

function claveCarrito(usuarioId: number | string | null | undefined): string {
  return usuarioId ? `${PREFIJO_CARRITO}_${usuarioId}` : CLAVE_INVITADO;
}

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

function cargarItemsGuardados(clave: string): itemCarrito[] {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado === null) return [];

    const datos: unknown = JSON.parse(guardado);
    if (!Array.isArray(datos)) return [];

    return datos.filter(esItemCarrito);
  } catch {
    return [];
  }
}

function guardarItems(clave: string, items: itemCarrito[]): void {
  try {
    localStorage.setItem(clave, JSON.stringify(items));
  } catch {
  }
}

function fusionarItems(base: itemCarrito[], nuevos: itemCarrito[]): itemCarrito[] {
  const resultado = base.map(item => ({ ...item }));

  for (const nuevo of nuevos) {
    const existente = resultado.find(item => item.producto.id === nuevo.producto.id);
    if (existente) {
      existente.cantidad += nuevo.cantidad;
    } else {
      resultado.push({ ...nuevo });
    }
  }

  return resultado;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly auth = inject(AuthService);
  private clave = claveCarrito(this.auth.usuarioLogueado()?.id);

  private items = signal<itemCarrito[]>(cargarItemsGuardados(this.clave));

  totalProductos = computed(() =>
    this.items().reduce(
      (suma, item) => suma + item.producto.precio * item.cantidad,
      0
    )
  );

  private readonly envioService = inject(EnvioService);

  readonly codigoPostal = signal('');
  readonly cotizacion = signal<CotizacionEnvio | null>(null);
  readonly calculandoEnvio = signal(false);
  readonly errorEnvio = signal<string | null>(null);

  readonly envio = computed(() => this.cotizacion()?.envio ?? 0);

  readonly totalCompra = computed(() => this.cotizacion()?.total ?? this.totalProductos());
  productos = this.items.asReadonly();

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
          this.errorEnvio.set('No se pudo calcular el envío. Revisá el código postal y la conexión con el servidor.');
          this.calculandoEnvio.set(false);
        },
      });

      onCleanup(() => suscripcion.unsubscribe());
    });

    effect(() => {
      const nuevaClave = claveCarrito(this.auth.usuarioLogueado()?.id);

      untracked(() => {
        if (nuevaClave === this.clave) return;

        const claveAnterior = this.clave;
        const eraInvitado = claveAnterior === CLAVE_INVITADO;
        const esInvitado = nuevaClave === CLAVE_INVITADO;
        this.clave = nuevaClave;

        if (eraInvitado && !esInvitado) {
          const fusionado = fusionarItems(cargarItemsGuardados(nuevaClave), this.items());
          this.items.set(fusionado);
          guardarItems(nuevaClave, fusionado);
          localStorage.removeItem(claveAnterior);
        } else if (esInvitado) {
          this.items.set([]);
          localStorage.removeItem(CLAVE_INVITADO);
        } else {
          this.items.set(cargarItemsGuardados(nuevaClave));
        }

        this.direccion.set(null);
        this.codigoPostal.set('');
      });
    });
  }

  private actualizarItems(fn: (items: itemCarrito[]) => itemCarrito[]) {
    this.items.update(fn);
    guardarItems(this.clave, this.items());
  }

  agregarProducto(producto: Producto, cantidad = 1) {
    this.actualizarItems(items => {
      const existente = items.find(item => item.producto.id === producto.id);
      return existente
        ? items.map(item =>
            item.producto.id === producto.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          )
        : [...items, { producto, cantidad }];
    });
  }

  eliminarProducto(itemAEliminar: itemCarrito): void {
    this.actualizarItems(items => {
      const encontrado = items.find(item => item.producto.id === itemAEliminar.producto.id);
      if (!encontrado) return items;

      if (encontrado.cantidad > 1) {
        return items.map(item =>
          item.producto.id === itemAEliminar.producto.id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
      }

      return items.filter(item => item.producto.id !== itemAEliminar.producto.id);
    });
  }

  establecerDireccion(direccion: string) {
    this.direccion.set(direccion);
  }

  vaciarCarrito() {
    this.actualizarItems(() => []);
  }
}