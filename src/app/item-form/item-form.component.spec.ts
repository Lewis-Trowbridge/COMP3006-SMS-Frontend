import { render, screen } from '@testing-library/angular'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { ItemFormComponent } from './item-form.component'
import { AppModule } from '../app.module'
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatGridListModule } from '@angular/material/grid-list'
import userEvent from '@testing-library/user-event'
import { IItem, ItemServiceService } from '../item-service.service'
import { Observable, Subject } from 'rxjs'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'

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

  it('does not send a request if the form is invalid', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(ItemFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatButtonModule)
      .keep(MatButtonModule)
      .keep(MatGridListModule)
      .build()

    const mockCreate = jest.fn().mockReturnValue(new Observable<IItem>())
    MockInstance(ItemServiceService, 'create', mockCreate)

    const { findByRole } = await render(ItemFormComponent, moduleMetadata)
    const submitButton = await findByRole('button', { name: 'Create' })
    await user.click(submitButton)

    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('opens the barcode scanner dialog when the scan button is clicked', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(ItemFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatButtonModule)
      .keep(MatButtonModule)
      .keep(MatGridListModule)
      .keep(MatProgressSpinnerModule)
      .keep(MatDialogModule)
      .build()

    const { findByRole } = await render(ItemFormComponent, moduleMetadata)

    const scanButton = await findByRole('button', { name: 'Scan' })
    await user.click(scanButton)
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('displays the result in the barcode form on a successful scan', async () => {
    const user = userEvent.setup()
    const barcode = 'barcode'
    const fakeSubject = new Subject<string>()
    const mockAfterClosed = jest.fn().mockReturnValue(fakeSubject)
    const moduleMetadata = MockBuilder(ItemFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatButtonModule)
      .keep(MatButtonModule)
      .keep(MatGridListModule)
      .keep(MatProgressSpinnerModule)
      .keep(MatDialogModule)
      .provide({
        provide: MatDialog,
        useValue: {
          open: jest.fn().mockReturnValue({ afterClosed: mockAfterClosed })
        }
      })
      .build()
    const { findByRole, findByLabelText } = await render(ItemFormComponent, moduleMetadata)

    const scanButton = await findByRole('button', { name: 'Scan' })
    await user.click(scanButton)
    fakeSubject.next(barcode)

    const barcodeInput = await findByLabelText('Barcode')
    expect(barcodeInput).toHaveValue(barcode)
  })

  it('calls the create method when all valid fields are filled', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(ItemFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .keep(MatButtonModule)
      .keep(MatButtonModule)
      .keep(MatGridListModule)
      .keep(MatProgressSpinnerModule)
      .build()
    const item: IItem = {
      _id: undefined,
      name: 'name',
      barcode: 'barcode',
      position: 'position',
      stock: 1
    }
    const fakeSubject = new Subject<IItem>()
    const mockCreate = jest.fn().mockReturnValue(fakeSubject)
    MockInstance(ItemServiceService, 'create', mockCreate)

    const { findByRole, detectChanges } = await render(ItemFormComponent, moduleMetadata)

    const nameInput = await findByRole('textbox', { name: 'Name' }) as HTMLInputElement
    await user.click(nameInput)
    await user.keyboard(item.name)

    const barcodeInput = await findByRole('textbox', { name: 'Barcode' }) as HTMLInputElement
    await user.click(barcodeInput)
    await user.keyboard(item.barcode)

    const positionInput = await findByRole('textbox', { name: 'Position' }) as HTMLInputElement
    await user.click(positionInput)
    await user.keyboard(item.position)

    const stockInput = await findByRole('spinbutton', { name: 'Stock' }) as HTMLInputElement
    await user.click(stockInput)
    await user.keyboard(item.stock.toString())

    const submitButton = await findByRole('button', { name: 'Create' })
    expect(submitButton).toHaveTextContent('Create')
    await user.click(submitButton)
    const spinner = await findByRole('progressbar')

    expect(submitButton).not.toHaveTextContent('Create')
    expect(submitButton).toContainElement(spinner)

    // Send data to subscribed observer in component
    fakeSubject.next(item)
    detectChanges()
    expect(spinner).not.toBeInTheDocument()
    expect(submitButton).toHaveTextContent('Create')

    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenNthCalledWith(1, item)
  }, 10000)
})
