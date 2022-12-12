import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BarcodeReaderComponent } from './barcode-reader/barcode-reader.component';
import {ZXingScannerModule} from "@zxing/ngx-scanner";

@NgModule({
  declarations: [
    AppComponent,
    BarcodeReaderComponent
  ],
  imports: [
    BrowserModule,
    ZXingScannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
