import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorGroupComponent } from './operator-group.component';

describe('OperatorGroupComponent', () => {
  let component: OperatorGroupComponent;
  let fixture: ComponentFixture<OperatorGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
