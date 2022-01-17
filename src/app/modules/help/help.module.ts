import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HelpPageComponent,
    ReportPageComponent,
    UserSettingsPageComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
  ],
})
export class HelpModule {}
