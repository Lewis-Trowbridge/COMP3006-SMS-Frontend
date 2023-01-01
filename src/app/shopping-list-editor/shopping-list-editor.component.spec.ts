import { MockBuilder } from 'ng-mocks'
import { ShoppingListEditorComponent } from './shopping-list-editor.component'
import { AppModule } from '../app.module'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { of } from 'rxjs'
import { render } from '@testing-library/angular'

describe('ShoppingListEditorComponent', () => {
  it('gets the list ID from a route on creation', async () => {
    const expectedListId = 'list'
    const moduleMetadata = MockBuilder(ShoppingListEditorComponent, AppModule)
      .provide({
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ listId: expectedListId })) }
      })
      .build()

    const { fixture } = await render(ShoppingListEditorComponent, moduleMetadata)

    expect(fixture.componentInstance.listId).toEqual(expectedListId)
  })
})
