import { PrismicService } from './prismic/prismic.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CookieModule } from 'ngx-cookie';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes';

import { HelpModule } from './modules/help/help.module';
import { PreviewModule } from './modules/preview/preview.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    CookieModule.forRoot(),
    HelpModule,
    PreviewModule
  ],
  providers: [PrismicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
