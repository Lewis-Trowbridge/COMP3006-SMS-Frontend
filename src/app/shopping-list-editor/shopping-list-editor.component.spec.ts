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
import userEvent from '@testing-library/user-event'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

describe('ShoppingListEditorComponent', () => {
  it('gets the list ID from a route on creation', async () => {
    const expectedListId = 'list'
    const moduleMetadata = MockBuilder(ShoppingListEditorComponent, AppModule)
      .provide({
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ listId: expectedListId })) }
      })
      .build()
    const fakeCanonicalObserver = new Subject<IShoppingListItem[]>()
    const mockRegisterChangeObservers = jest.fn().mockReturnValue(fakeCanonicalObserver)
    MockInstance(ShoppingListServiceService, 'registerChangeObservers', mockRegisterChangeObservers)

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

  it('makes a new row when the add button is clicked', async () => {
    const user = userEvent.setup()
    const expectedListId = 'list'
    const moduleMetadata = MockBuilder(ShoppingListEditorComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatListModule)
      .keep(MatInputModule)
      .keep(MatIconModule)
      .keep(MatButtonModule)
      .provide({
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ listId: expectedListId })) }
      })
      .build()
    const fakeCanonicalObserver = new Subject<IShoppingListItem[]>()
    const mockRegisterChangeObservers = jest.fn().mockReturnValue(fakeCanonicalObserver)
    MockInstance(ShoppingListServiceService, 'registerChangeObservers', mockRegisterChangeObservers)

    const { findByRole, findByLabelText } = await render(ShoppingListEditorComponent, moduleMetadata)

    const addButton = await findByRole('button', { name: 'Add new item' })
    await user.click(addButton)

    expect(await findByLabelText('Item 1 quantity')).toBeInTheDocument()
    expect(await findByLabelText('Item 1 text')).toBeInTheDocument()
    expect(await findByLabelText('Item 2 quantity')).toBeInTheDocument()
    expect(await findByLabelText('Item 2 text')).toBeInTheDocument()
  })
})
