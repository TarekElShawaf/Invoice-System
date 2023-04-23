import { TestBed } from '@angular/core/testing';

import { DbservService } from './dbserv.service';

describe('DbservService', () => {
  let service: DbservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
