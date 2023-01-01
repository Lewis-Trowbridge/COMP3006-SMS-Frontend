import { MockBuilder, MockInstance } from 'ng-mocks'
import { ShoppingListEditorComponent } from './shopping-list-editor.component'
import { AppModule } from '../app.module'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { of, Subject } from 'rxjs'
import { render } from '@testing-library/angular'
import { ReactiveFormsModule } from '@angular/forms'
import { MatListModule } from '@angular/material/list'
import { MatInputModule } from '@angular/material/input'
import { ShoppingListServiceService, IShoppingListItem } from '../shopping-list-service.service'

describe('ShoppingListEditorComponent', () => {
  it('gets the list ID from a route on creation', async () => {
    const expectedListId = 'list'
    const moduleMetadata = MockBuilder(ShoppingListEditorComponent, AppModule)
      .provide({
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ listId: expectedListId })) }
      })
      .build()

    const { fixture } = await render(ShoppingListEditorComponent, moduleMetadata)

    expect(fixture.componentInstance.listId).toEqual(expectedListId)
  })

  it('makes a row with elements for each received list item from socket observable', async () => {
    const expectedListId = 'list'
    const fakeCanonicalObserver = new Subject<IShoppingListItem[]>()
    const mockRegisterChangeObservers = jest.fn().mockReturnValue(fakeCanonicalObserver)
    const expectedItem: IShoppingListItem = {
      _id: 'id',
      text: 'text',
      quantity: 1
    }
    const moduleMetadata = MockBuilder(ShoppingListEditorComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatListModule)
      .keep(MatInputModule)
      .provide({
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ listId: expectedListId })) }
      })
      .build()
    MockInstance(ShoppingListServiceService, 'registerChangeObservers', mockRegisterChangeObservers)

    const { findByLabelText } = await render(ShoppingListEditorComponent, moduleMetadata)

    fakeCanonicalObserver.next([expectedItem])

    const quantityElement = await findByLabelText('Item 1 quantity')
    const textElement = await findByLabelText('Item 1 text')

    expect(quantityElement).toHaveValue(expectedItem.quantity)
    expect(textElement).toHaveValue(expectedItem.text)
  })
})
