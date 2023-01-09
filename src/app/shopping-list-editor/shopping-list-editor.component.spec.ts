import { MockBuilder, MockInstance } from 'ng-mocks'
import { ShoppingListEditorComponent } from './shopping-list-editor.component'
import { AppModule } from '../app.module'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { Observable, of, Subject } from 'rxjs'
import { render } from '@testing-library/angular'
import { ReactiveFormsModule } from '@angular/forms'
import { MatListModule } from '@angular/material/list'
import { MatInputModule } from '@angular/material/input'
import { ShoppingListSocketService, IShoppingListItem, IShoppingList } from '../shopping-list-socket.service'
import userEvent from '@testing-library/user-event'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { waitFor } from '@testing-library/dom'
import { ShoppingListRESTService } from '../shopping-list-rest.service'
import { mock } from 'jest-mock-extended'

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
    MockInstance(ShoppingListSocketService, 'registerChangeObservers', mockRegisterChangeObservers)

    const { fixture } = await render(ShoppingListEditorComponent, moduleMetadata)

    expect(fixture.componentInstance.listId).toEqual(expectedListId)
  })

  it('calls get list on creation with list ID from route', async () => {
    const expectedListId = 'list'
    const moduleMetadata = MockBuilder(ShoppingListEditorComponent, AppModule)
      .provide({
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ listId: expectedListId })) }
      })
      .build()
    const fakeListGetObserver = new Subject<IShoppingList>()
    const mockListGet = jest.fn().mockReturnValue(fakeListGetObserver)
    MockInstance(ShoppingListRESTService, 'get', mockListGet)
    MockInstance(ShoppingListSocketService, 'registerChangeObservers', jest.fn().mockReturnValue(new Observable()))

    await render(ShoppingListEditorComponent, moduleMetadata)

    await waitFor(() => expect(mockListGet).toBeCalledTimes(1))
    expect(mockListGet).toHaveBeenNthCalledWith(1, expectedListId)
  })

  it('loads list item data on creation', async () => {
    const expectedListId = 'list'
    const fakeListGetObserver = new Subject<IShoppingList>()
    const mockListGet = jest.fn().mockReturnValue(fakeListGetObserver)
    const expectedItem: IShoppingListItem = {
      _id: 'id',
      text: 'text',
      quantity: 2
    }
    const mockList = mock<IShoppingList>({ items: [expectedItem] })
    const moduleMetadata = MockBuilder(ShoppingListEditorComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatListModule)
      .keep(MatInputModule)
      .provide({
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ listId: expectedListId })) }
      })
      .build()
    MockInstance(ShoppingListRESTService, 'get', mockListGet)
    MockInstance(ShoppingListSocketService, 'registerChangeObservers', jest.fn().mockReturnValue(new Observable()))

    const { findByLabelText } = await render(ShoppingListEditorComponent, moduleMetadata)

    fakeListGetObserver.next(mockList)

    const quantityElement = await findByLabelText('Item 1 quantity')
    const textElement = await findByLabelText('Item 1 text')

    expect(quantityElement).toHaveValue(expectedItem.quantity)
    expect(textElement).toHaveValue(expectedItem.text)
  })

  it('makes a row with elements for each received list item from socket observable', async () => {
    const expectedListId = 'list'
    const fakeCanonicalObserver = new Subject<IShoppingListItem[]>()
    const mockRegisterChangeObservers = jest.fn().mockReturnValue(fakeCanonicalObserver)
    const expectedItem: IShoppingListItem = {
      _id: 'id',
      text: 'text',
      quantity: 2
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
    MockInstance(ShoppingListRESTService, 'get', jest.fn().mockReturnValue(new Observable()))
    MockInstance(ShoppingListSocketService, 'registerChangeObservers', mockRegisterChangeObservers)

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
    MockInstance(ShoppingListRESTService, 'get', jest.fn().mockReturnValue(new Observable()))
    MockInstance(ShoppingListSocketService, 'registerChangeObservers', mockRegisterChangeObservers)

    const { findByRole, findByLabelText } = await render(ShoppingListEditorComponent, moduleMetadata)

    const addButton = await findByRole('button', { name: 'Add new item' })
    await user.click(addButton)

    expect(await findByLabelText('Item 1 quantity')).toBeInTheDocument()
    expect(await findByLabelText('Item 1 text')).toBeInTheDocument()
    expect(await findByLabelText('Item 2 quantity')).toBeInTheDocument()
    expect(await findByLabelText('Item 2 text')).toBeInTheDocument()
  })

  it('sends an update to the service observer when a change is made', async () => {
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
    let changes: IShoppingListItem = { _id: '', text: '', quantity: 0 }
    const expectedChanges = 'item'
    const fakeCanonicalObserver = new Subject<IShoppingListItem[]>()
    const mockRegisterChangeObservers = jest.fn().mockReturnValue(fakeCanonicalObserver)
    MockInstance(ShoppingListRESTService, 'get', jest.fn().mockReturnValue(new Observable()))
    MockInstance(ShoppingListSocketService, 'registerChangeObservers', mockRegisterChangeObservers)

    const { fixture, findByLabelText } = await render(ShoppingListEditorComponent, moduleMetadata)

    const textInput = await findByLabelText('Item 1 text')
    fixture.componentInstance.items.valueChanges.subscribe(value => { changes = value as unknown as IShoppingListItem })
    await user.type(textInput, expectedChanges)
    await waitFor(() => expect(changes).toContainEqual({ _id: '', text: expectedChanges, quantity: 1 }))
  })

  it('sends an update to the service observer when a change is made to an exsiting item', async () => {
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
    let changes: IShoppingListItem[] = [{ _id: '', text: '', quantity: 0 }]
    const fakeCanonicalObserver = new Subject<IShoppingListItem[]>()
    const mockRegisterChangeObservers = jest.fn().mockReturnValue(fakeCanonicalObserver)
    MockInstance(ShoppingListRESTService, 'get', jest.fn().mockReturnValue(new Observable()))
    MockInstance(ShoppingListSocketService, 'registerChangeObservers', mockRegisterChangeObservers)

    const { fixture, findByLabelText } = await render(ShoppingListEditorComponent, moduleMetadata)

    const expectedChanges = 'item'
    const expectedChanges2 = 'extended'
    const textInput = await findByLabelText('Item 1 text')
    fixture.componentInstance.items.valueChanges.subscribe(value => { changes = value as unknown as IShoppingListItem[] })
    await user.type(textInput, expectedChanges)
    await waitFor(() => expect(changes[0].text).toEqual(expectedChanges))
    await user.type(textInput, expectedChanges2)
    await waitFor(() => expect(changes[0].text).toEqual(expectedChanges + expectedChanges2))
  })
})
