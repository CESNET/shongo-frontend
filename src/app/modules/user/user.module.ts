import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [UserSettingsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    NgxSkeletonLoaderModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class UserModule {}
