import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashDriveComponent } from './dash-drive.component';

describe('DashDriveComponent', () => {
  let component: DashDriveComponent;
  let fixture: ComponentFixture<DashDriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashDriveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
