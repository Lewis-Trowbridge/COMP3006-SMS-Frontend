import { Component } from '@angular/core';

@Component({
  selector: 'app-barcode-reader',
  templateUrl: './barcode-reader.component.html',
  styleUrls: ['./barcode-reader.component.css']
})
export class BarcodeReaderComponent {

  mediaDevices: MediaDeviceInfo[] = []

  handleCamerasFound(mediaDeviceInfo: MediaDeviceInfo[]) {
    this.mediaDevices = mediaDeviceInfo
  }

  handleSuccess(value: string) {
    console.log(value)
  }
}
