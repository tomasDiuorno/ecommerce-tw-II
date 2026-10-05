import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoItem } from './carrito-item';

describe('CarritoItem', () => {
  let component: CarritoItem;
  let fixture: ComponentFixture<CarritoItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
