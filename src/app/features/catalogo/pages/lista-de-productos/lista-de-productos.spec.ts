import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListaDeProductos } from './lista-de-productos';

describe('ListaDeProductos', () => {
  it('combina búsqueda y categoría y permite buscar después de un error', () => {
    const parametros = new BehaviorSubject(convertToParamMap({ categoria: '2', busqueda: 'teclado' }));
    TestBed.configureTestingModule({
      imports: [ListaDeProductos],
      providers: [provideHttpClient(), provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { queryParamMap: parametros } }],
    });
    const component = TestBed.createComponent(ListaDeProductos).componentInstance;
    const http = TestBed.inject(HttpTestingController);
    component.ngOnInit();
    const primera = http.expectOne(req => req.params.get('categoria') === '2' && req.params.get('busqueda') === 'teclado');
    primera.flush({}, { status: 500, statusText: 'Error' });
    expect(component.error()).not.toBeNull();
    expect(component.cargando()).toBe(false);
    parametros.next(convertToParamMap({ busqueda: 'monitor' }));
    const segunda = http.expectOne(req => req.params.get('busqueda') === 'monitor' && !req.params.has('categoria'));
    segunda.flush([]);
    expect(component.error()).toBeNull();
    expect(component.cargando()).toBe(false);
    http.verify();
  });
});
