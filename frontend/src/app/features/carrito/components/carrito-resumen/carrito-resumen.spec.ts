import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoResumen } from './carrito-resumen';

describe('CarritoResumen', () => {
  let component: CarritoResumen;
  let fixture: ComponentFixture<CarritoResumen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoResumen],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoResumen);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalProductos', 0);
    fixture.componentRef.setInput('envio', 0);
    fixture.componentRef.setInput('totalCompra', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('emite la búsqueda y la limpia al cerrar', async () => {
    const emitir = vi.fn();
    component.direccionABuscar.subscribe(emitir);
    component.toggleDireccion();
    await fixture.whenStable();

    const elemento = fixture.nativeElement as HTMLElement;
    const input = elemento.querySelector<HTMLInputElement>('input[placeholder="Buscar calle, barrio..."]')!;
    input.value = 'San Martín';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(emitir).toHaveBeenLastCalledWith('San Martín');

    component.toggleDireccion();
    await fixture.whenStable();
    expect(emitir).toHaveBeenLastCalledWith('');
  });

  it('usa el código de la API y permite completar uno cuando falta', async () => {
    component.seleccionarDireccion({ id: 1, direccion: 'Dirección uno', codigoPostal: ' b1754jec ' });
    await fixture.whenStable();
    expect(component.codigoPostal()).toBe('B1754JEC');

    component.seleccionarDireccion({ id: 2, direccion: 'Dirección dos', codigoPostal: null });
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;
    const input = elemento.querySelector<HTMLInputElement>('#codigo-postal')!;
    expect(input.value).toBe('');
    input.value = ' 1754 ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(component.codigoPostal()).toBe('');

    component.aplicarCodigoPostal();
    await fixture.whenStable();
    expect(component.codigoPostal()).toBe('1754');
  });});
