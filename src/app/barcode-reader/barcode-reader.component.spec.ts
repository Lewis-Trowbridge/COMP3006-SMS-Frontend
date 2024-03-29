import { BarcodeReaderComponent } from './barcode-reader.component'
import { render } from '@testing-library/angular'
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { EventEmitter } from '@angular/core'
import { mock } from 'jest-mock-extended'
import { AppModule } from '../app.module'
import { ReactiveFormsModule } from '@angular/forms'
import userEvent from '@testing-library/user-event'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'

describe('BarcodeReaderComponent', () => {
  it('should display all available video inputs', async () => {
    const testEmitter = new EventEmitter<MediaDeviceInfo[]>()
    const mockDevice1Name = 'mockDevice1'
    const mockDevice1 = mock<MediaDeviceInfo>({
      label: mockDevice1Name
    })
    const mockDevice2Name = 'mockDevice2'
    const mockDevice2 = mock<MediaDeviceInfo>({
      label: mockDevice2Name
    })

    const expected = [
      mockDevice1,
      mockDevice2
    ]
    const moduleMetadata = MockBuilder(BarcodeReaderComponent, AppModule)
      .mock(ZXingScannerModule)
      .mock(MatDialogModule)
      .provide({ provide: MatDialogRef, useValue: {} })
      .keep(ReactiveFormsModule)
      .build()
    MockInstance(ZXingScannerComponent, 'camerasFound', testEmitter)

    const { findByText } = await render(BarcodeReaderComponent, moduleMetadata)

    testEmitter.emit(expected)

    expect(await findByText(mockDevice1Name)).toBeInTheDocument()
    expect(await findByText(mockDevice2Name)).toBeInTheDocument()
  })

  it('should set a device correctly when selected from options', async () => {
    const user = userEvent.setup()
    const testEmitter = new EventEmitter<MediaDeviceInfo[]>()
    const mockDevice1Name = 'mockDevice1'
    const mockDevice1 = mock<MediaDeviceInfo>({
      label: mockDevice1Name
    })
    const mockDevice2Name = 'mockDevice2'
    const mockDevice2 = mock<MediaDeviceInfo>({
      label: mockDevice2Name
    })

    const expected = [
      mockDevice1,
      mockDevice2
    ]
    const moduleMetadata = MockBuilder(BarcodeReaderComponent, AppModule)
      .mock(ZXingScannerModule)
      .mock(MatDialogModule)
      .provide({ provide: MatDialogRef, useValue: {} })
      .keep(ReactiveFormsModule)
      .build()
    const mockDeviceSet = jest.fn()
    MockInstance(ZXingScannerComponent, 'camerasFound', testEmitter)
    MockInstance(ZXingScannerComponent, 'device', mockDeviceSet, 'set')

    const { findByRole } = await render(BarcodeReaderComponent, moduleMetadata)

    testEmitter.emit(expected)

    const selectElement = await findByRole('combobox')
    await user.selectOptions(selectElement, mockDevice1Name)
    const option1 = await findByRole('option', { name: mockDevice1Name }) as HTMLOptionElement
    const option2 = await findByRole('option', { name: mockDevice2Name }) as HTMLOptionElement
    expect(option1.selected).toBe(true)
    expect(option2.selected).toBe(false)
    expect(mockDeviceSet).toHaveBeenCalledTimes(2)
    expect(mockDeviceSet).toHaveBeenNthCalledWith(1, undefined)
    expect(mockDeviceSet).toHaveBeenNthCalledWith(2, mockDevice1)
  })

  it('should close and return the code when a code is successfully scanned', async () => {
    const testEmitter = new EventEmitter<string>()

    const expected = 'code'
    const mockClose = jest.fn()
    const moduleMetadata = MockBuilder(BarcodeReaderComponent, AppModule)
      .mock(ZXingScannerModule)
      .provide({ provide: MatDialogRef, useValue: { close: mockClose } })
      .keep(ReactiveFormsModule)
      .build()
    MockInstance(ZXingScannerComponent, 'scanSuccess', testEmitter)

    await render(BarcodeReaderComponent, moduleMetadata)

    testEmitter.emit(expected)

    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenNthCalledWith(1, expected)
  })
})
