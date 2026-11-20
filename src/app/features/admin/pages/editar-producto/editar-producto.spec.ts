import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { EditarProducto } from './editar-producto';
import { CatalogoService } from '../../../catalogo/services/catalogo';
import { ProductosAdminService } from '../../services/productos-admin-service';
import { Producto } from '../../../../shared/models/producto';

const producto: Producto = {
  id: 1, nombre: 'Teclado', descripcion: 'Teclado de prueba', categoria: 'Periféricos',
  categoriaId: 1, precio: 100, imagen: null, stock: 0, disponible: false, destacado: false,
};

describe('EditarProducto', () => {
  let fixture: ComponentFixture<EditarProducto>;
  let component: EditarProducto;
  const obtenerPorId = vi.fn();
  const editarProducto = vi.fn();

  beforeEach(async () => {
    obtenerPorId.mockReset().mockReturnValue(of(producto));
    editarProducto.mockReset().mockReturnValue(new Subject<Producto>());
    await TestBed.configureTestingModule({
      imports: [EditarProducto],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
        { provide: ProductosAdminService, useValue: { obtenerPorId, editarProducto } },
        { provide: CatalogoService, useValue: {
          categorias: signal([{ id: 1, nombre: 'Periféricos', imagen: '', color: '' }]),
          cargando: signal(false), error: signal(null), cargarCategorias: vi.fn(),
        } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EditarProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('bloquea el envío y muestra el error al activar un producto sin stock', async () => {
    component.formulario.disponible().value.set(true);
    await fixture.whenStable();
    component.guardar(new Event('submit'));
    await fixture.whenStable();
    expect(editarProducto).not.toHaveBeenCalled();
    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.querySelector('#editar-disponible-error')?.textContent).toContain('sin stock');
    expect(elemento.querySelector('#editar-disponible')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('permite guardar sin stock cuando se mantiene inactivo', () => {
    component.guardar(new Event('submit'));
    expect(editarProducto).toHaveBeenCalledWith(expect.objectContaining({ disponible: false }));
  });

  it('permite activar cuando el producto tiene stock', () => {
    obtenerPorId.mockReturnValue(of({ ...producto, stock: 3 }));
    component.cargarDatos();
    component.formulario.disponible().value.set(true);
    component.guardar(new Event('submit'));
    expect(editarProducto).toHaveBeenCalledWith(expect.objectContaining({ disponible: true }));
  });

  it('quita el error al desmarcar la disponibilidad y permite guardar', async () => {
    component.formulario.disponible().value.set(true);
    await fixture.whenStable();
    component.formulario.disponible().value.set(false);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('#editar-disponible-error')).toBeNull();
    component.guardar(new Event('submit'));
    expect(editarProducto).toHaveBeenCalledTimes(1);
  });
});