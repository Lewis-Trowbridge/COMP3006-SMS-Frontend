import { render } from '@testing-library/angular'
import { MockBuilder } from 'ng-mocks'
import { ItemFormComponent } from './item-form.component'
import { AppModule } from '../app.module'
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatGridListModule } from '@angular/material/grid-list'
import userEvent from '@testing-library/user-event'

describe('ItemFormComponent', () => {
  const user = userEvent.setup()

  it.each([{ name: 'Name', role: 'textbox' },
    { name: 'Barcode', role: 'textbox' },
    { name: 'Position', role: 'textbox' },
    { name: 'Stock', role: 'spinbutton' }])('$name input should show validation error if value left blank', async ({ name, role }) => {
    const moduleMetadata = MockBuilder(ItemFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatButtonModule)
      .keep(MatButtonModule)
      .keep(MatGridListModule)
      .build()

    const { findByRole, findByText } = await render(ItemFormComponent, moduleMetadata)
    const input = await findByRole(role, { name }) as HTMLInputElement
    await user.click(input)
    await user.keyboard('[Backspace]')
    await user.tab()
    const errorMessage = `${name} is required.`
    const errorElement = await findByText(errorMessage)
    expect(errorElement).toHaveTextContent(errorMessage)
    expect(errorElement).toHaveClass('mat-mdc-form-field-error')
  })
})
