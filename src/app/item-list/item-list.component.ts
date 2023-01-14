import { Component, OnInit } from '@angular/core'
import { IItem, ItemServiceService } from '../item-service.service'

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: IItem[] = []
  display = ['name', 'barcode', 'position', 'stock']

  constructor (private readonly itemService: ItemServiceService) { }

  ngOnInit (): void {
    this.itemService.listAll().subscribe(data => { this.items = data })
  }
}
