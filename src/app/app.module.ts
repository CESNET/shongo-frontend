import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeModule } from './modules/home/home.module';
import { MatPaginatorI18nService } from './mat-paginator-intl.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, HomeModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorI18nService }],
  bootstrap: [AppComponent],
})
export class AppModule {}
