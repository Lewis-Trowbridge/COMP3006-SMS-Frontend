import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { IItem, ItemServiceService } from '../item-service.service'
import { MatDialog } from '@angular/material/dialog'
import { BarcodeReaderComponent } from '../barcode-reader/barcode-reader.component'

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent {
  itemGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    barcode: new FormControl('', [Validators.required]),
    position: new FormControl('', [Validators.required]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)])
  })

  isLoading = false

  constructor (private readonly itemService: ItemServiceService,
    private readonly dialog: MatDialog) { }

  onSubmit (): void {
    if (this.itemGroup.valid) {
      const result = this.itemService.create(this.itemGroup.value as IItem)
      this.isLoading = true
      result.subscribe(() => {
        this.isLoading = false
      })
    }
  }

  onScanButtonClick (): void {
    this.dialog.open(BarcodeReaderComponent).afterClosed()
      .subscribe(result => this.itemGroup.controls.barcode.setValue(result))
  }
}
