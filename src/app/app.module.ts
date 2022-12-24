import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

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

@NgModule({
  declarations: [
    AppComponent,
    BarcodeReaderComponent,
    ItemFormComponent
  ],
  imports: [
    BrowserModule,
    ZXingScannerModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
