import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IShoppingListItem, ShoppingListSocketService } from '../shopping-list-socket.service'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { Observable } from 'rxjs'
import { ShoppingListRESTService } from '../shopping-list-rest.service'
import { ItemServiceService } from '../item-service.service'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectID = require('bson-objectid')

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
      this.constructFormGroup()
    ])
  })

  listId = ''

  autocompleteItems: string[] = []

  get items (): FormArray<FormGroup<IShoppingListItemFormGroup>> {
    return this.formGroup.controls.items
  }

  constructor (private readonly routeInfo: ActivatedRoute,
    private readonly shoppingListRestService: ShoppingListRESTService,
    private readonly shoppingListSocketService: ShoppingListSocketService,
    private readonly itemService: ItemServiceService) { }

  ngOnInit (): void {
    this.routeInfo.paramMap.subscribe(params => {
      this.listId = params.get('listId') ?? ''
      this.shoppingListRestService.get(this.listId).subscribe(data => this.displayChanges(data.items))

      this.shoppingListSocketService.registerChangeObservers(
        this.listId,
        this.items.valueChanges as Observable<IShoppingListItem[]>)
        .subscribe(canonical => this.displayChanges(canonical))
    })
  }

  addItem (): void {
    const form = this.constructFormGroup(ObjectID())
    this.items.push(form)
  }

  clearAutocomplete (): void {
    this.autocompleteItems = []
  }

  private constructFormGroup (id = '', text = '', quantity = 1): FormGroup<IShoppingListItemFormGroup> {
    const formGroup = new FormGroup<IShoppingListItemFormGroup>({
      _id: new FormControl<string>(id, { nonNullable: true }),
      text: new FormControl<string>(text, { nonNullable: true }),
      quantity: new FormControl<number>(quantity, { nonNullable: true })
    })
    formGroup.controls.text.valueChanges
      .subscribe(value => this.itemService.findByName(value)
        .subscribe(names => {
          this.autocompleteItems = names
        }))
    return formGroup
  }

  private displayChanges (changes: IShoppingListItem[]): void {
    while (this.items.length !== 0) {
      this.items.removeAt(0, { emitEvent: false })
    }
    for (const item of changes) {
      this.items.push(this.constructFormGroup(item._id, item.text, item.quantity), { emitEvent: false })
    }
  }
}
