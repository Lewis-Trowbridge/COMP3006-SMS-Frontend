import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { BarcodeFormat } from '@zxing/browser'

@Component({
  selector: 'app-barcode-reader',
  templateUrl: './barcode-reader.component.html',
  styleUrls: ['./barcode-reader.component.css']
})
export class BarcodeReaderComponent {
  mediaDevices: MediaDeviceInfo[] = []
  currentMediaDevice: MediaDeviceInfo | undefined
  cameraFormControl = new FormControl()
  barcodeFormats = [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128]

  constructor (public dialogRef: MatDialogRef<BarcodeReaderComponent>) {
    this.cameraFormControl.valueChanges.subscribe(value => {
      this.currentMediaDevice = this.mediaDevices.find(device => device.label === value)
    })
  }

  handleCamerasFound (mediaDeviceInfo: MediaDeviceInfo[]): void {
    this.mediaDevices = mediaDeviceInfo
  }

  handleSuccess (value: string): void {
    this.dialogRef.close(value)
  }
}
