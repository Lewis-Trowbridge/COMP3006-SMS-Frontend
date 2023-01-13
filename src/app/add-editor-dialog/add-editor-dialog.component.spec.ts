import { ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { render, waitFor } from '@testing-library/angular'
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
})
