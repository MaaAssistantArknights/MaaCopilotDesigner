import { TestBed } from '@angular/core/testing';

import { SearchGridService } from './search-grid.service';

describe('SearchGridService', () => {
  let service: SearchGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
