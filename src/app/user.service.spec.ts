import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { environment } from '../environments/environment'

import { UserService, UserType } from './user.service'

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
        expect(data).toBe(UserType.Customer)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/users/login`,
        method: 'POST'
      })

      req.flush({ type: UserType.Customer })

      expect(req.request.body).toEqual({ username: testUsername, password: testPassword })

      httpTestingController.verify()
    })

    it('returns false when request returns 401', (done) => {
      const testUsername = 'username'
      const testPassword = 'password'
      const response = service.login(testUsername, testPassword)
      response.subscribe(data => {
        expect(data).toBeUndefined()
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

  describe('logout', () => {
    it('makes request to backend', (done) => {
      const response = service.logout()
      response.subscribe(data => {
        expect(data).toBeNull()
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/users/logout`,
        method: 'GET'
      })

      req.flush(null)

      httpTestingController.verify()
    })
  })

  describe('search', () => {
    it('returns data from backend', (done) => {
      const expectedUsername = 'user'
      const expectedResponse = ['searchUser']
      const response = service.search(expectedUsername)
      response.subscribe(data => {
        expect(data).toEqual(expectedResponse)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/users/search?name=${expectedUsername}`,
        method: 'GET'
      })

      req.flush(expectedResponse)

      expect(req.request.params.get('name')).toEqual(expectedUsername)

      httpTestingController.verify()
    })
  })
})
