import { TestBed } from '@angular/core/testing';

import { ShoppingListRESTService } from './shopping-list-rest.service';

describe('ShoppingListRESTService', () => {
  let service: ShoppingListRESTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingListRESTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
