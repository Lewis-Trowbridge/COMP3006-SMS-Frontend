import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { environment } from '../environments/environment'
import { IShoppingList } from './shopping-list-socket.service'

@Injectable({
  providedIn: 'root'
})
export class ShoppingListRESTService {
  constructor (private readonly httpClient: HttpClient) { }

  get (listId: string): Observable<IShoppingList> {
    return this.httpClient.get<IShoppingList>(`${environment.BACKEND_URL}/lists/get`, { params: { listId } })
  }

  listAll (): Observable<IShoppingList[]> {
    return this.httpClient.get<IShoppingList[]>(`${environment.BACKEND_URL}/lists/list-all`)
      .pipe(map(response => {
        response.map(value => {
          value.created = new Date(value.created)
          value.updated = new Date(value.updated)
          return value
        })
        return response
      }
      ))
  }
}
