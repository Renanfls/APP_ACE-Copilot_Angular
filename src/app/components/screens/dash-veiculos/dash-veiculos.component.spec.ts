import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashVeiculosComponent } from './dash-veiculos.component';

describe('DashVeiculosComponent', () => {
  let component: DashVeiculosComponent;
  let fixture: ComponentFixture<DashVeiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashVeiculosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashVeiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
