import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarStock } from './gestionar-stock';

describe('GestionarStock', () => {
  let component: GestionarStock;
  let fixture: ComponentFixture<GestionarStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarStock],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarStock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
