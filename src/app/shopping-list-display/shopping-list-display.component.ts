import { Component, OnInit } from '@angular/core'
import { ShoppingListRESTService } from '../shopping-list-rest.service'
import { IShoppingList } from '../shopping-list-socket.service'

@Component({
  selector: 'app-shopping-list-display',
  templateUrl: './shopping-list-display.component.html',
  styleUrls: ['./shopping-list-display.component.css']
})
export class ShoppingListDisplayComponent implements OnInit {
  lists: IShoppingList[] = []

  constructor (private readonly shoppingListRestService: ShoppingListRESTService) { }

  ngOnInit (): void {
    this.shoppingListRestService.listAll().subscribe(data => {
      this.lists = data
    })
  }
}
