import { RouterModule } from '@angular/router'
import { render } from '@testing-library/angular'
import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { of } from 'rxjs'
import { AppModule } from '../app.module'
import { ShoppingListEditorComponent } from '../shopping-list-editor/shopping-list-editor.component'
import { ShoppingListRESTService } from '../shopping-list-rest.service'
import { IShoppingList } from '../shopping-list-socket.service'
import { ShoppingListDisplayComponent } from './shopping-list-display.component'

describe('ShoppingListDisplayComponent', () => {
  it('shows a message if no lists are returned', async () => {
    const moduleMetadata = MockBuilder(ShoppingListDisplayComponent, AppModule)
      .keep(RouterModule)
      .build()
    MockInstance(ShoppingListRESTService, 'listAll', () => of<IShoppingList[]>([]))

    const { findByText } = await render(ShoppingListDisplayComponent, moduleMetadata)

    const message = await findByText('It looks like you don\'t have any shopping lists yet. Why not create one?')

    expect(message).toBeInTheDocument()
    expect(message).toHaveClass('no-list-message')
  })

  it('calls the create method when new button is clicked', async () => {
    const user = userEvent.setup()
    const currentTime = new Date()
    const fakeShoppingList: IShoppingList = {
      _id: 'listId',
      ownerId: 'owner',
      editors: [],
      created: currentTime,
      updated: currentTime,
      items: []
    }
    const mockCreate = jest.fn().mockReturnValue(of<IShoppingList>(fakeShoppingList))
    const moduleMetadata = MockBuilder(ShoppingListDisplayComponent, AppModule)
      .keep(RouterModule)
      .build()
    MockInstance(ShoppingListRESTService, 'listAll', () => of<IShoppingList[]>([]))
    MockInstance(ShoppingListRESTService, 'create', mockCreate)

    const { findByRole } = await render(ShoppingListDisplayComponent, {
      routes: [{
        path: 'edit/:listId', component: ShoppingListEditorComponent
      }],
      ...moduleMetadata
    })

    const newButton = await findByRole('button', { name: 'New' })
    await user.click(newButton)

    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1))
  })

  it('loads all available lists on load', async () => {
    const currentTime = new Date()
    const fakeShoppingList: IShoppingList = {
      _id: 'listId',
      ownerId: 'owner',
      editors: [],
      created: currentTime,
      updated: currentTime,
      items: []
    }
    const moduleMetadata = MockBuilder(ShoppingListDisplayComponent, AppModule)
      .keep(RouterModule)
      .build()
    MockInstance(ShoppingListRESTService, 'listAll', () => of<IShoppingList[]>([fakeShoppingList]))

    const { findByText } = await render(ShoppingListDisplayComponent, moduleMetadata)
    expect(await findByText(`${fakeShoppingList.ownerId}'s list`)).toBeInTheDocument()
    expect(await findByText(`Created: ${fakeShoppingList.created.toUTCString()}`)).toBeInTheDocument()
    expect(await findByText(`Updated: ${fakeShoppingList.updated.toUTCString()}`)).toBeInTheDocument()
  })
})
