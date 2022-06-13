import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCopilotComponent } from './search-copilot.component';

describe('SearchCopilotComponent', () => {
  let component: SearchCopilotComponent;
  let fixture: ComponentFixture<SearchCopilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCopilotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCopilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
