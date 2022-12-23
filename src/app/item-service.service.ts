import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../environments/environment'
import { Observable } from 'rxjs'

export interface IItem {
  name: string
  barcode: string
  position: string
  stock: number
}

@Injectable({
  providedIn: 'root'
})
export class ItemServiceService {
  constructor (private readonly httpClient: HttpClient) { }

  create (item: IItem): Observable<IItem> {
    return this.httpClient.post<IItem>(`${environment.BACKEND_URL}/items/create`, item)
  }
}
