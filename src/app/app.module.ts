import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component'
import { BarcodeReaderComponent } from './barcode-reader/barcode-reader.component'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
import { ReactiveFormsModule } from '@angular/forms'
import { ItemFormComponent } from './item-form/item-form.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatGridListModule } from '@angular/material/grid-list'
import { HttpClientModule } from '@angular/common/http'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ShoppingListEditorComponent } from './shopping-list-editor/shopping-list-editor.component'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io'
import { environment } from '../environments/environment'

const routes: Routes = [
  { path: 'item/create', component: ItemFormComponent }
]

const socketIoConfig: SocketIoConfig = {
  url: `${environment.BACKEND_URL}/`
}

@NgModule({
  declarations: [
    AppComponent,
    BarcodeReaderComponent,
    ItemFormComponent,
    ShoppingListEditorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ZXingScannerModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    SocketIoModule.forRoot(socketIoConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
