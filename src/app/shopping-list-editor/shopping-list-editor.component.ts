import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IShoppingListItem, ShoppingListServiceService as ShoppingListSocketService } from '../shopping-list-socket.service'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { Observable } from 'rxjs'
import { ShoppingListRESTService } from '../shopping-list-rest.service'

interface IShoppingListItemFormGroup {
  _id: FormControl<string>
  text: FormControl<string>
  quantity: FormControl<number>
}

@Component({
  selector: 'app-shopping-list-editor',
  templateUrl: './shopping-list-editor.component.html',
  styleUrls: ['./shopping-list-editor.component.css']
})
export class ShoppingListEditorComponent implements OnInit {
  formGroup = new FormGroup({
    items: new FormArray([
      new FormGroup<IShoppingListItemFormGroup>({
        _id: new FormControl<string>('', { nonNullable: true }),
        text: new FormControl<string>('', { nonNullable: true }),
        quantity: new FormControl<number>(1, { nonNullable: true })
      })
    ])
  })

  listId = ''

  get items (): FormArray<FormGroup<IShoppingListItemFormGroup>> {
    return this.formGroup.controls.items
  }

  constructor (private readonly routeInfo: ActivatedRoute,
    private readonly shoppingListRestService: ShoppingListRESTService,
    private readonly shoppingListSocketService: ShoppingListSocketService) { }

  ngOnInit (): void {
    this.routeInfo.paramMap.subscribe(params => {
      this.listId = params.get('listId') ?? ''
      console.log(this.listId)
      this.shoppingListRestService.get(this.listId).subscribe(data => {
        while (this.items.length !== 0) {
          this.items.removeAt(0, { emitEvent: false })
        }
        for (const item of data.items) {
          this.items.push(new FormGroup<IShoppingListItemFormGroup>({
            _id: new FormControl<string>(item._id, { nonNullable: true }),
            text: new FormControl<string>(item.text, { nonNullable: true }),
            quantity: new FormControl<number>(item.quantity, { nonNullable: true })
          }), { emitEvent: false })
        }
      })

      this.shoppingListSocketService.registerChangeObservers(
        this.listId,
        this.items.valueChanges as Observable<IShoppingListItem[]>)
        .subscribe(canonical => this.items.setValue(canonical))
    })
  }

  addItem (): void {
    this.items.push(new FormGroup<IShoppingListItemFormGroup>({
      _id: new FormControl<string>('', { nonNullable: true }),
      text: new FormControl<string>('', { nonNullable: true }),
      quantity: new FormControl<number>(1, { nonNullable: true })
    }))
  }
}
