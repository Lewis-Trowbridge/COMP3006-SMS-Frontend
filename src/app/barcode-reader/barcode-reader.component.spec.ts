import { BarcodeReaderComponent } from './barcode-reader.component'
import { render } from '@testing-library/angular'
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { EventEmitter } from '@angular/core'
import { mock } from 'jest-mock-extended'
import { AppModule } from '../app.module'
import { ReactiveFormsModule } from '@angular/forms'

describe('BarcodeReaderComponent', () => {
  it('should create', async () => {
    const { queryByText } = await render(BarcodeReaderComponent, { imports: [ZXingScannerModule] })
    expect(queryByText('barcode-reader works!')).toBeInTheDocument()
  })

  it('should display all available video inputs', async () => {
    const testEmitter = new EventEmitter<MediaDeviceInfo[]>()
    const mockDevice1Name = 'mockDevice1'
    const mockDevice1 = mock<MediaDeviceInfo>({
      label: mockDevice1Name
    })

    const expected = [
      mockDevice1
    ]
    const moduleMetadata = MockBuilder(BarcodeReaderComponent, AppModule)
      .mock(ZXingScannerModule)
      .keep(ReactiveFormsModule)
      .build()
    MockInstance(ZXingScannerComponent, 'camerasFound', testEmitter)

    const { findByText } = await render(BarcodeReaderComponent, moduleMetadata)

    testEmitter.emit(expected)

    expect(await findByText(mockDevice1Name)).toBeInTheDocument()
  })
})
