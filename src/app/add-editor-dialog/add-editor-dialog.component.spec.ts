import { ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatOptionModule } from '@angular/material/core'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { render, screen, waitFor } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { of } from 'rxjs'
import { AppModule } from '../app.module'
import { ShoppingListRESTService } from '../shopping-list-rest.service'
import { UserService } from '../user.service'
import { AddEditorDialogComponent, AddEditorDialogData } from './add-editor-dialog.component'

describe('AddEditorDialogComponent', () => {
  it('should send the username and given list ID to shopping list service', async () => {
    const user = userEvent.setup()
    const expectedData: AddEditorDialogData = {
      listId: 'list'
    }
    const expectedUsername = 'user'
    const moduleMetadata = MockBuilder(AddEditorDialogComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatDialogModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatAutocompleteModule)
      .provide({ provide: MatDialogRef, useValue: {} })
      .provide({ provide: MAT_DIALOG_DATA, useValue: expectedData })
      .build()
    const mockAddEditor = jest.fn().mockReturnValue(of<string | null>(null))
    MockInstance(ShoppingListRESTService, 'addEditor', mockAddEditor)
    MockInstance(UserService, 'search', () => of<string[]>([]))

    const { findByLabelText, findByRole } = await render(AddEditorDialogComponent, moduleMetadata)

    const searchInput = await findByLabelText('Search')
    await user.type(searchInput, expectedUsername)

    const submitButton = await findByRole('button', { name: 'Add editor' })
    await user.click(submitButton)

    await waitFor(() => expect(mockAddEditor).toHaveBeenCalledTimes(1))
    expect(mockAddEditor).toHaveBeenNthCalledWith(1, expectedData.listId, expectedUsername)
  })

  it('should close the dialog if no error is returned', async () => {
    const user = userEvent.setup()
    const mockClose = jest.fn()
    const moduleMetadata = MockBuilder(AddEditorDialogComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatDialogModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatAutocompleteModule)
      .provide({ provide: MatDialogRef, useValue: { close: mockClose } })
      .provide({ provide: MAT_DIALOG_DATA, useValue: { listId: 'list' } })
      .build()
    MockInstance(ShoppingListRESTService, 'addEditor', jest.fn().mockReturnValue(of<string | null>(null)))
    MockInstance(UserService, 'search', () => of<string[]>([]))

    const { findByLabelText, findByRole } = await render(AddEditorDialogComponent, moduleMetadata)

    const searchInput = await findByLabelText('Search')
    await user.type(searchInput, 'user')

    const submitButton = await findByRole('button', { name: 'Add editor' })
    await user.click(submitButton)

    await waitFor(() => expect(mockClose).toHaveBeenCalled())
  })

  it('should display the error message if an error message is returned', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(AddEditorDialogComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatDialogModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatAutocompleteModule)
      .provide({ provide: MatDialogRef, useValue: {} })
      .provide({ provide: MAT_DIALOG_DATA, useValue: { listId: 'list' } })
      .build()
    const expectedErrorMessage = 'very bad error'
    MockInstance(ShoppingListRESTService, 'addEditor', jest.fn().mockReturnValue(of<string | null>(expectedErrorMessage)))
    MockInstance(UserService, 'search', () => of<string[]>([]))

    const { findByLabelText, findByRole, findByText } = await render(AddEditorDialogComponent, moduleMetadata)

    const searchInput = await findByLabelText('Search')
    await user.type(searchInput, 'user')

    const submitButton = await findByRole('button', { name: 'Add editor' })
    await user.click(submitButton)

    expect(await findByText(expectedErrorMessage)).toBeInTheDocument()
  })

  it('should call search with search content on type', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(AddEditorDialogComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatDialogModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatAutocompleteModule)
      .keep(MatOptionModule)
      .provide({ provide: MatDialogRef, useValue: {} })
      .provide({ provide: MAT_DIALOG_DATA, useValue: { listId: 'list' } })
      .build()
    const mockSearch = jest.fn().mockReturnValue(of<string[]>([]))
    MockInstance(ShoppingListRESTService, 'addEditor', () => of<string | null>(null))
    MockInstance(UserService, 'search', mockSearch)

    const { findByLabelText } = await render(AddEditorDialogComponent, moduleMetadata)

    const expectedTypedUsername = 'user'
    const searchInput = await findByLabelText('Search')
    await user.type(searchInput, expectedTypedUsername)

    await waitFor(() => expect(mockSearch).toHaveBeenCalledTimes(expectedTypedUsername.length))
    expect(mockSearch).toHaveBeenNthCalledWith(expectedTypedUsername.length, expectedTypedUsername)
  })

  it('should display results from user search in autocomplete', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(AddEditorDialogComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatDialogModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatAutocompleteModule)
      .keep(MatOptionModule)
      .provide({ provide: MatDialogRef, useValue: {} })
      .provide({ provide: MAT_DIALOG_DATA, useValue: { listId: 'list' } })
      .build()
    const expectedUsernames = ['user', 'user 2']
    const mockSearch = jest.fn().mockReturnValue(of<string[]>(expectedUsernames))
    MockInstance(ShoppingListRESTService, 'addEditor', () => of<string | null>(null))
    MockInstance(UserService, 'search', mockSearch)

    const { findByLabelText } = await render(AddEditorDialogComponent, moduleMetadata)

    const searchInput = await findByLabelText('Search')
    await user.type(searchInput, 'user')

    expect(await screen.findByRole('option', { name: expectedUsernames[0] })).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: expectedUsernames[1] })).toBeInTheDocument()
  })
})
