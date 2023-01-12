import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { environment } from '../environments/environment'

import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService

  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
    service = TestBed.inject(UserService)
    TestBed.inject(HttpClient)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  describe('login', () => {
    it('returns true when request is successful', (done) => {
      const testUsername = 'username'
      const testPassword = 'password'
      const response = service.login(testUsername, testPassword)
      response.subscribe(data => {
        expect(data).toBe(true)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/users/login`,
        method: 'POST'
      })

      req.flush(null)

      expect(req.request.body).toEqual({ username: testUsername, password: testPassword })

      httpTestingController.verify()
    })

    it('returns false when request returns 401', (done) => {
      const testUsername = 'username'
      const testPassword = 'password'
      const response = service.login(testUsername, testPassword)
      response.subscribe(data => {
        expect(data).toBe(false)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/users/login`,
        method: 'POST'
      })

      req.flush(null, { status: 401, statusText: 'Unauthorised.' })

      expect(req.request.body).toEqual({ username: testUsername, password: testPassword })

      httpTestingController.verify()
    })
  })
})
