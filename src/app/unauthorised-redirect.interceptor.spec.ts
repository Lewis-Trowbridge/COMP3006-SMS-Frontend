import { TestBed } from '@angular/core/testing'

import { UnauthorisedRedirectInterceptor } from './unauthorised-redirect.interceptor'

describe('UnauthorisedRedirectInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UnauthorisedRedirectInterceptor
    ]
  }))

  it('should be created', () => {
    const interceptor: UnauthorisedRedirectInterceptor = TestBed.inject(UnauthorisedRedirectInterceptor)
    expect(interceptor).toBeTruthy()
  })
})
