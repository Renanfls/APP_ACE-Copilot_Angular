import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionDayComponent } from './mission-day.component';

describe('MissionDayComponent', () => {
  let component: MissionDayComponent;
  let fixture: ComponentFixture<MissionDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
