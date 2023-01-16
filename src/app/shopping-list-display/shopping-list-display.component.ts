import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ShoppingListRESTService } from '../shopping-list-rest.service'
import { IShoppingList } from '../shopping-list-socket.service'

@Component({
  selector: 'app-shopping-list-display',
  templateUrl: './shopping-list-display.component.html',
  styleUrls: ['./shopping-list-display.component.css']
})
export class ShoppingListDisplayComponent implements OnInit {
  lists: IShoppingList[] = []

  constructor (private readonly shoppingListRestService: ShoppingListRESTService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  ngOnInit (): void {
    this.shoppingListRestService.listAll().subscribe(data => {
      this.lists = data
    })
  }

  create (): void {
    this.shoppingListRestService.create().subscribe(data => {
      void this.router.navigate(['edit', data._id], { relativeTo: this.route })
    })
  }
}
