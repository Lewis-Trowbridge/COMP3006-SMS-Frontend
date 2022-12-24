import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { IItem, ItemServiceService } from '../item-service.service'

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

  constructor (private readonly itemService: ItemServiceService) { }

  onSubmit (): void {
    const result = this.itemService.create(this.itemGroup.value as IItem)
    this.isLoading = true
    result.subscribe(() => {
      this.isLoading = false
    })
  }
}
