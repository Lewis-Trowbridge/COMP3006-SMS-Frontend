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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ShoppingListEditorComponent } from './shopping-list-editor/shopping-list-editor.component'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io'
import { environment } from '../environments/environment'
import { ShoppingListDisplayComponent } from './shopping-list-display/shopping-list-display.component'
import { LoginFormComponent } from './login-form/login-form.component'
import { CookieInterceptor } from './cookie.interceptor'
import { AddEditorDialogComponent } from './add-editor-dialog/add-editor-dialog.component'
import { CreateUserFormComponent } from './create-user-form/create-user-form.component'
import { ItemListComponent } from './item-list/item-list.component'

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'create', component: CreateUserFormComponent },
  { path: 'items', component: ItemListComponent },
  { path: 'items/create', component: ItemFormComponent },
  { path: 'lists', component: ShoppingListDisplayComponent },
  { path: 'lists/edit/:listId', component: ShoppingListEditorComponent }
]

const socketIoConfig: SocketIoConfig = {
  url: `${environment.BACKEND_URL}/`
}

@NgModule({
  declarations: [
    AppComponent,
    BarcodeReaderComponent,
    ItemFormComponent,
    ShoppingListEditorComponent,
    ShoppingListDisplayComponent,
    AddEditorDialogComponent,
    LoginFormComponent,
    CreateUserFormComponent,
    ItemListComponent
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
    MatCardModule,
    MatAutocompleteModule,
    MatTableModule,
    SocketIoModule.forRoot(socketIoConfig)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CookieInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
