import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
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
}
