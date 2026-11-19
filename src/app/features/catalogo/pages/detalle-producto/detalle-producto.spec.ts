import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DetalleProducto } from './detalle-producto';
import { CatalogoService } from '../../services/catalogo';
import { CarritoService } from '../../../carrito/services/carrito';
import { Producto } from '../../../../shared/models/producto';

const productoBase: Producto = {
  id: 1,
  nombre: 'Auriculares Gamer',
  descripcion: 'Auriculares con micrófono y sonido envolvente.',
  categoria: 'electronics',
  precio: 15000,
  imagen: 'https://example.com/auriculares.png',
  disponible: true,
  destacado: false,
};

describe('DetalleProducto', () => {
  let fixture: ComponentFixture<DetalleProducto>;
  let component: DetalleProducto;

  const catalogoMock = {
    obtenerPorId: vi.fn(),
    cargarProductos: vi.fn(),
  };
  const carritoMock = {
    agregarProducto: vi.fn(),
  };

  // Crea el componente con el producto que devuelve el catálogo (o undefined si no existe).
  async function crearComponente(producto: Producto | undefined, id = '1') {
    catalogoMock.obtenerPorId.mockReturnValue(producto);

    await TestBed.configureTestingModule({
      imports: [DetalleProducto],
      providers: [
        provideRouter([]),
        { provide: CatalogoService, useValue: catalogoMock },
        { provide: CarritoService, useValue: carritoMock },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function html(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function botonPorLabel(label: string): HTMLButtonElement {
    return html().querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;
  }

  function botonAgregar(): HTMLButtonElement {
    return html().querySelector('button[aria-describedby="ayuda-compra"]') as HTMLButtonElement;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('se crea correctamente', async () => {
    await crearComponente(productoBase);
    expect(component).toBeTruthy();
  });

  it('carga los productos al iniciar', async () => {
    await crearComponente(productoBase);
    expect(catalogoMock.cargarProductos).toHaveBeenCalledTimes(1);
  });

  it('busca el producto por el id de la ruta', async () => {
    await crearComponente(productoBase, '1');
    expect(catalogoMock.obtenerPorId).toHaveBeenCalledWith(1);
  });

  it('muestra nombre, categoría y descripción del producto', async () => {
    await crearComponente(productoBase);

    const texto = html().textContent ?? '';
    expect(html().querySelector('h1')?.textContent).toContain('Auriculares Gamer');
    expect(texto).toContain('electronics');
    expect(texto).toContain('Auriculares con micrófono y sonido envolvente.');
  });

  it('muestra la imagen con su texto alternativo', async () => {
    await crearComponente(productoBase);

    const img = html().querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('alt')).toBe('Auriculares Gamer');
  });

  it('muestra el precio formateado', async () => {
    await crearComponente(productoBase);
    expect(html().textContent).toMatch(/15[.,]000/);
  });

  it('muestra "Producto no encontrado" si el id no existe', async () => {
    await crearComponente(undefined, '999');

    expect(html().querySelector('h1')?.textContent).toContain('No encontramos ese producto');
    expect(botonAgregar()).toBeNull();
  });

  describe('cantidad', () => {
    it('empieza en 1', async () => {
      await crearComponente(productoBase);
      expect(component.cantidad()).toBe(1);
    });

    it('aumenta al tocar "+"', async () => {
      await crearComponente(productoBase);

      botonPorLabel('Aumentar cantidad').click();
      fixture.detectChanges();

      expect(component.cantidad()).toBe(2);
      expect(html().querySelector('output')?.textContent).toContain('2');
    });

    it('disminuye al tocar "-" pero nunca baja de 1', async () => {
      await crearComponente(productoBase);

      component.aumentar();
      component.disminuir();
      component.disminuir();

      expect(component.cantidad()).toBe(1);
    });

    it('el botón "-" está deshabilitado cuando la cantidad es 1', async () => {
      await crearComponente(productoBase);
      expect(botonPorLabel('Disminuir cantidad').disabled).toBe(true);
    });
  });

  describe('agregar al carrito', () => {
    it('llama al servicio con el producto y la cantidad elegida', async () => {
      await crearComponente(productoBase);

      component.aumentar();
      component.aumentar();
      fixture.detectChanges();

      botonAgregar().click();

      expect(carritoMock.agregarProducto).toHaveBeenCalledWith(productoBase, 3);
    });

    it('reinicia la cantidad a 1 después de agregar', async () => {
      await crearComponente(productoBase);

      component.aumentar();
      botonAgregar().click();

      expect(component.cantidad()).toBe(1);
    });
  });

  describe('producto sin stock', () => {
    const sinStock: Producto = { ...productoBase, disponible: false };

    it('deshabilita el botón de agregar y muestra "No disponible"', async () => {
      await crearComponente(sinStock);

      expect(botonAgregar().disabled).toBe(true);
      expect(botonAgregar().textContent).toContain('No disponible');
    });

    it('deshabilita los botones de cantidad', async () => {
      await crearComponente(sinStock);

      expect(botonPorLabel('Aumentar cantidad').disabled).toBe(true);
      expect(botonPorLabel('Disminuir cantidad').disabled).toBe(true);
    });

    it('no agrega al carrito al hacer click', async () => {
      await crearComponente(sinStock);

      botonAgregar().click();

      expect(carritoMock.agregarProducto).not.toHaveBeenCalled();
    });
  });
});