import { TestBed } from '@angular/core/testing';

import { NodejsService } from './nodejs.service';

describe('NodejsService', () => {
  let service: NodejsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodejsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
