import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GestionarStock } from './gestionar-stock';
import { Producto } from '../../../../shared/models/producto';

const api = 'http://localhost:3000/api/productos';
const producto: Producto = {
  id: 1, nombre: 'Teclado', descripcion: 'Teclado de prueba', categoria: 'Periféricos',
  precio: 100, imagen: null, stock: 5, disponible: false, destacado: false,
};

describe('GestionarStock', () => {
  let component: GestionarStock;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionarStock],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '1' })) } },
      ],
    });
    component = TestBed.createComponent(GestionarStock).componentInstance;
    http = TestBed.inject(HttpTestingController);
    component.ngOnInit();
    http.expectOne(`${api}/1`).flush(producto);
  });

  afterEach(() => http.verify());

  it('agrega una sola vez y conserva el estado confirmado por el servidor', () => {
    component.formularioStock.controls.cantidad.setValue(3);
    component.agregarStock();
    component.agregarStock();
    const peticion = http.expectOne(`${api}/agregarStock/1`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ stock: 3 });
    peticion.flush(null, { status: 204, statusText: 'No Content' });
    http.expectOne(`${api}/1`).flush({ ...producto, stock: 8 }); //Flush simula la respuesta y le envia los datos al subscribe
    expect(component.producto()?.disponible).toBe(false);
    expect(component.producto()?.stock).toBe(8);
    expect(component.guardando()).toBe(false);
  });

  it('quita stock por la ruta correcta y refleja la desactivación', () => {
    component.producto.set({ ...producto, disponible: true });
    component.formularioStock.controls.cantidad.setValue(5);
    component.quitarStock();
    const peticion = http.expectOne(`${api}/quitarStock/1`);
    expect(peticion.request.body).toEqual({ stock: 5 });
    peticion.flush(null, { status: 204, statusText: 'No Content' });
    http.expectOne(`${api}/1`).flush({ ...producto, stock: 0 });
    expect(component.producto()?.stock).toBe(0);
    expect(component.producto()?.disponible).toBe(false);
  });

  it('rechaza decimales y egresos superiores al stock sin enviar peticiones', () => {
    component.formularioStock.controls.cantidad.setValue(1.5);
    component.agregarStock();
    component.formularioStock.controls.cantidad.setValue(6);
    component.quitarStock();
    http.expectNone(request => request.method === 'POST');
    expect(component.error()).toContain('supera');
  });

  it('no invita a repetir una operación confirmada si falla la recarga', () => {
    component.formularioStock.controls.cantidad.setValue(2);
    component.agregarStock();
    http.expectOne(`${api}/agregarStock/1`).flush(null, { status: 204, statusText: 'No Content' });
    http.expectOne(`${api}/1`).flush({}, { status: 500, statusText: 'Server Error' });
    expect(component.producto()).toBeNull();
    expect(component.error()).toContain('no repitas');
    expect(component.guardando()).toBe(false);
  });
});
