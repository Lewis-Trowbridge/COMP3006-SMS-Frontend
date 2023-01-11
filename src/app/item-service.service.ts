import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../environments/environment'
import { map, Observable } from 'rxjs'

export interface IItem {
  name: string
  barcode: string
  position: string
  stock: number
}

export interface IFindByNameResponse {
  results: IItem[]
}

@Injectable({
  providedIn: 'root'
})
export class ItemServiceService {
  constructor (private readonly httpClient: HttpClient) { }

  create (item: IItem): Observable<IItem> {
    return this.httpClient.post<IItem>(`${environment.BACKEND_URL}/items/create`, item)
  }

  findByName (name: string): Observable<string[]> {
    return this.httpClient.get<IFindByNameResponse>(`${environment.BACKEND_URL}/items/find-name`, { params: { name } })
      .pipe(map(items => {
        const names = items.results.map(item => {
          return item.name
        })
        return names
      }))
  }
}
