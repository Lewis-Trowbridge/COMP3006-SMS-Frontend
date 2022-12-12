import { Component } from '@angular/core';
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-barcode-reader',
  templateUrl: './barcode-reader.component.html',
  styleUrls: ['./barcode-reader.component.css']
})
export class BarcodeReaderComponent {

  mediaDevices: MediaDeviceInfo[] = []
  currentMediaDevice: MediaDeviceInfo | undefined
  cameraFormControl = new FormControl()

  constructor() {
    this.cameraFormControl.valueChanges.subscribe(value => {
      this.currentMediaDevice = this.mediaDevices.find(device => device.label == value)
    })
  }

  handleCamerasFound(mediaDeviceInfo: MediaDeviceInfo[]) {
    this.mediaDevices = mediaDeviceInfo
  }

  handleSuccess(value: string) {
    console.log(value)
  }
}
