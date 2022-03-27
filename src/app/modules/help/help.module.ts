import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { RouterModule } from '@angular/router';
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpRoutingModule } from './help-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [HelpPageComponent, ReportPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    HelpRoutingModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class HelpModule {}
