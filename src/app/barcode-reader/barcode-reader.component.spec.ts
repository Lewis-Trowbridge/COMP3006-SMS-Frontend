import { BarcodeReaderComponent } from './barcode-reader.component';
import {render} from "@testing-library/angular";
import {ZXingScannerModule} from "@zxing/ngx-scanner";

describe('BarcodeReaderComponent', () => {

  it('should create', async () => {
    const { queryByText } = await render(BarcodeReaderComponent, { imports: [ZXingScannerModule] })
    expect(queryByText("barcode-reader works!")).toBeInTheDocument()
  });
});
