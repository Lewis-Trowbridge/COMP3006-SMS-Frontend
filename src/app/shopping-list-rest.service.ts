import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, Observable, of } from 'rxjs'
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

  create (): Observable<IShoppingList> {
    return this.httpClient.post<IShoppingList>(`${environment.BACKEND_URL}/lists/create`, {})
  }

  addEditor (listId: string, username: string): Observable<string | null> {
    return this.httpClient.patch<null>(`${environment.BACKEND_URL}/lists/add-editor`, { listId, userId: username })
      .pipe(catchError((error: HttpErrorResponse) => of(error.statusText)))
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
