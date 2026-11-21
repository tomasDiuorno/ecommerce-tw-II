import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoDatosForm } from './producto-datos-form';

describe('ProductoDatosForm', () => {
  let component: ProductoDatosForm;
  let fixture: ComponentFixture<ProductoDatosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoDatosForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoDatosForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
