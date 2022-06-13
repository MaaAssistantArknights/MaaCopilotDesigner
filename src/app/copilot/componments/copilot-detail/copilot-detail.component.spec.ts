import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotDetailComponent } from './copilot-detail.component';

describe('CopilotDetailComponent', () => {
  let component: CopilotDetailComponent;
  let fixture: ComponentFixture<CopilotDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
