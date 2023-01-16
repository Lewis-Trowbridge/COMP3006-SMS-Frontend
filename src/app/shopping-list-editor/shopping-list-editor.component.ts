import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IShoppingListItem, ShoppingListSocketService } from '../shopping-list-socket.service'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { Observable } from 'rxjs'
import { ShoppingListRESTService } from '../shopping-list-rest.service'
import { ItemServiceService } from '../item-service.service'
import { MatDialog } from '@angular/material/dialog'
import { AddEditorDialogComponent } from '../add-editor-dialog/add-editor-dialog.component'
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
export class ShoppingListEditorComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    items: new FormArray([
      this.constructFormGroup()
    ])
  })

  saving = false
  listId = ''
  autocompleteItems: string[] = []

  get items (): FormArray<FormGroup<IShoppingListItemFormGroup>> {
    return this.formGroup.controls.items
  }

  constructor (private readonly routeInfo: ActivatedRoute,
    private readonly shoppingListRestService: ShoppingListRESTService,
    private readonly shoppingListSocketService: ShoppingListSocketService,
    private readonly itemService: ItemServiceService,
    private readonly dialog: MatDialog) { }

  ngOnInit (): void {
    this.routeInfo.paramMap.subscribe(params => {
      this.listId = params.get('listId') ?? ''
      this.shoppingListRestService.get(this.listId).subscribe(data => this.displayChanges(data.items))

      const observers = this.shoppingListSocketService.registerChangeObservers(
        this.listId,
        this.items.valueChanges as Observable<IShoppingListItem[]>)

      observers.distributeCanonical.subscribe(canonical => this.displayChanges(canonical))

      this.items.valueChanges.subscribe(() => { this.saving = true })
      observers.acknowledge.subscribe(() => { this.saving = false })
    })
  }

  addItem (): void {
    const form = this.constructFormGroup(ObjectID())
    this.items.push(form)
  }

  removeItem (index: number): void {
    this.items.removeAt(index)
  }

  openEditorDialog (): void {
    this.dialog.open(AddEditorDialogComponent, { data: { listId: this.listId } })
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

  ngOnDestroy (): void {
    this.shoppingListSocketService.close()
  }
}
