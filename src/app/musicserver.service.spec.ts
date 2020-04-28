import { TestBed } from '@angular/core/testing';

import { MusicserverService } from './musicserver.service';

describe('MusicserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MusicserverService = TestBed.get(MusicserverService);
    expect(service).toBeTruthy();
  });
});
