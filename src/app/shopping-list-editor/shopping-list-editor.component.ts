import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

interface IShoppingListItem {
  text: string
  quantity: number
}

@Component({
  selector: 'app-shopping-list-editor',
  templateUrl: './shopping-list-editor.component.html',
  styleUrls: ['./shopping-list-editor.component.css']
})
export class ShoppingListEditorComponent implements OnInit {
  listId = ''
  items: IShoppingListItem[] = []

  constructor (private readonly routeInfo: ActivatedRoute) {}

  ngOnInit (): void {
    // Set list ID
    this.routeInfo.paramMap.subscribe(params => {
      this.listId = params.get('listId') ?? ''
    })
    // Get item data
  }
}
