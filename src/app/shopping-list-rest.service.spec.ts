import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { environment } from '../environments/environment'

import { ShoppingListRESTService } from './shopping-list-rest.service'
import { IShoppingList } from './shopping-list-socket.service'

describe('ShoppingListRESTService', () => {
  let service: ShoppingListRESTService
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
    service = TestBed.inject(ShoppingListRESTService)

    httpClient = TestBed.inject(HttpClient)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  describe('get', () => {
    it('should make a request to the backend with the given data', (done) => {
      const testList: IShoppingList = {
        _id: 'listId',
        ownerId: 'user',
        editors: [],
        created: new Date(),
        updated: new Date(),
        items: []
      }
      const response = service.get(testList._id)
      response.subscribe(data => {
        expect(data).toEqual(testList)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/lists/get?listId=${testList._id}`,
        method: 'GET'
      })

      expect(req.request.params.get('listId')).toEqual(testList._id)

      req.flush(testList)

      httpTestingController.verify()
    })
  })

  describe('create', () => {
    it('should make a request to the backend with the given data', (done) => {
      const testList: IShoppingList = {
        _id: 'listId',
        ownerId: 'user',
        editors: [],
        created: new Date(),
        updated: new Date(),
        items: []
      }
      const response = service.create()
      response.subscribe(data => {
        expect(data).toEqual(testList)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/lists/create`,
        method: 'POST'
      })

      req.flush(testList)

      expect(req.request.body).toEqual({})

      httpTestingController.verify()
    })
  })

  describe('addEditor', () => {
    it('should return null when request is successful', (done) => {
      const listId = 'list'
      const username = 'name'
      const response = service.addEditor(listId, username)
      response.subscribe(data => {
        expect(data).toEqual(null)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/lists/add-editor`,
        method: 'PATCH'
      })

      req.flush(null)

      expect(req.request.body).toEqual({
        listId,
        userId: username
      })

      httpTestingController.verify()
    })

    it('should return string message when request is unsuccessful', (done) => {
      const expectedErrorMessage = 'error message'
      const response = service.addEditor('list', 'user')
      response.subscribe(data => {
        expect(data).toEqual(expectedErrorMessage)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/lists/add-editor`,
        method: 'PATCH'
      })

      req.flush(null, { status: 404, statusText: expectedErrorMessage })

      httpTestingController.verify()
    })
  })

  describe('listAll', () => {
    it('should make a request to the backend with the given data', (done) => {
      const testList: IShoppingList = {
        _id: 'listId',
        ownerId: 'user',
        editors: [],
        created: new Date(),
        updated: new Date(),
        items: []
      }
      const response = service.listAll()
      response.subscribe(data => {
        expect(data).toContainEqual(testList)
        done()
      })

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/lists/list-all`,
        method: 'GET'
      })

      req.flush([testList])

      httpTestingController.verify()
    })
  })
})
