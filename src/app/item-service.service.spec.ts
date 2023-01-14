import { TestBed } from '@angular/core/testing'

import { IItem, ItemServiceService } from './item-service.service'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HttpClient } from '@angular/common/http'
import { environment } from '../environments/environment'

describe('ItemServiceService', () => {
  let service: ItemServiceService
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    service = TestBed.inject(ItemServiceService)
    httpClient = TestBed.inject(HttpClient)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  describe('create', () => {
    it('should make a request to the backend with the given data', () => {
      const testItem: IItem = {
        _id: undefined,
        name: 'name',
        barcode: 'barcode',
        position: 'position',
        stock: 0
      }
      const response = service.create(testItem)
      response.subscribe(data => expect(data).toEqual(testItem))

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/items/create`,
        method: 'POST'
      })

      expect(req.request.body).toEqual(testItem)

      req.flush(testItem)

      httpTestingController.verify()
    })
  })

  describe('listAll', () => {
    it('should make a request to the backend with the given data', () => {
      const testItem: IItem[] = [{
        _id: 'id',
        name: 'name',
        barcode: 'barcode',
        position: 'position',
        stock: 0
      }]
      const response = service.listAll()
      response.subscribe(data => expect(data).toEqual(testItem))

      const req = httpTestingController.expectOne({
        url: `${environment.BACKEND_URL}/items/list-all`,
        method: 'GET'
      })

      req.flush(testItem)

      httpTestingController.verify()
    })
  })
})
