import { TestBed } from '@angular/core/testing';

import { AuthdataService } from './authdata.service';

describe('AuthdataService', () => {
  let service: AuthdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
