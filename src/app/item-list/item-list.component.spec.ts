import { MatTableModule } from '@angular/material/table'
import { render } from '@testing-library/angular'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { of } from 'rxjs'
import { AppModule } from '../app.module'
import { IItem, ItemServiceService } from '../item-service.service'
import { ItemListComponent } from './item-list.component'

describe('ItemListComponent', () => {
  it('displays data in a table', async () => {
    const expectedData: IItem = {
      _id: 'id',
      name: 'name',
      barcode: 'barcode',
      position: 'position',
      stock: 1
    }

    const moduleMetadata = MockBuilder(ItemListComponent, AppModule)
      .keep(MatTableModule)
      .build()
    MockInstance(ItemServiceService, 'listAll', () => of<IItem[]>([expectedData]))

    const { findByRole } = await render(ItemListComponent, moduleMetadata)

    expect(await findByRole('cell', { name: expectedData.name })).toBeInTheDocument()
    expect(await findByRole('cell', { name: expectedData.barcode })).toBeInTheDocument()
    expect(await findByRole('cell', { name: expectedData.position })).toBeInTheDocument()
    expect(await findByRole('cell', { name: expectedData.stock.toString() })).toBeInTheDocument()
  })
})
