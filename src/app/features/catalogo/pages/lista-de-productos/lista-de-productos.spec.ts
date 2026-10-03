import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaDeProductos } from './lista-de-productos';

describe('ListaDeProductos', () => {
  let component: ListaDeProductos;
  let fixture: ComponentFixture<ListaDeProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaDeProductos],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDeProductos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
