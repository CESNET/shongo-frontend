import { TestBed } from '@angular/core/testing';

import { AdminTokenInterceptor } from './admin-token.interceptor';

describe('AdminTokenInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [AdminTokenInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: AdminTokenInterceptor = TestBed.inject(
      AdminTokenInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});
