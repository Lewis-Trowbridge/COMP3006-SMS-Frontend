import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent {
  itemGroup = new FormGroup({
    name: new FormControl(),
    barcode: new FormControl(),
    position: new FormControl(),
    stock: new FormControl()
  })
}
