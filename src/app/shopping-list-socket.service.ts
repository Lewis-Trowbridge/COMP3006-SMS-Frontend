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
  updated: Date
  items: IShoppingListItem[]
}

export interface IChangeObservers {
  acknowledge: Observable<null>
  distributeCanonical: Observable<IShoppingListItem[]>
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListSocketService {
  constructor (private readonly socket: Socket) { }

  registerChangeObservers (listId: string, changes: Observable<IShoppingListItem[]>): IChangeObservers {
    this.socket.connect()
    this.socket.emit('joinListRoom', listId)
    changes.subscribe(change => this.socket.emit('resolveChanges', listId, change))
    return {
      acknowledge: this.socket.fromEvent<null>('acknowledge'),
      distributeCanonical: this.socket.fromEvent<IShoppingListItem[]>('distributeCanonical')
    }
  }

  close (): void {
    this.socket.disconnect()
  }
}
