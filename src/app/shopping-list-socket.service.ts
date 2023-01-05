import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { Observable } from 'rxjs'

export interface IShoppingListItem {
  _id: string
  text: string
  quantity: number
}

export interface IShoppingList {
  _id: string
  ownerId: string
  editors: string[]
  created: Date
  updated: Date | null
  items: IShoppingListItem[]
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListServiceService {
  constructor (private readonly socket: Socket) { }

  registerChangeObservers (listId: string, changes: Observable<IShoppingListItem[]>): Observable<IShoppingListItem[]> {
    this.socket.emit('joinListRoom', listId)
    changes.subscribe(change => this.socket.emit('resolveChanges', listId, change))
    return this.socket.fromEvent<IShoppingListItem[]>('distributeCanonical')
  }
}
