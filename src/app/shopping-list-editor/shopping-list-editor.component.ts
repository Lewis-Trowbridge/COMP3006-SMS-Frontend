import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IShoppingListItem, ShoppingListServiceService } from '../shopping-list-service.service'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { Observable } from 'rxjs'

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
    private readonly shoppingListService: ShoppingListServiceService) { }

  ngOnInit (): void {
    this.routeInfo.paramMap.subscribe(params => {
      this.listId = params.get('listId') ?? ''
    })

    this.shoppingListService.registerChangeObservers(
      this.listId,
      this.items.valueChanges as Observable<IShoppingListItem[]>)
      .subscribe(canonical => this.items.setValue(canonical))
  }

  addItem (): void {
    this.items.push(new FormGroup<IShoppingListItemFormGroup>({
      _id: new FormControl<string>('', { nonNullable: true }),
      text: new FormControl<string>('', { nonNullable: true }),
      quantity: new FormControl<number>(1, { nonNullable: true })
    }))
  }
}
