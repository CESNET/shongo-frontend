import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationRequestFilterComponent } from './components/reservation-request-filter/reservation-request-filter.component';

@NgModule({
  declarations: [HomePageComponent, ReservationRequestFilterComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HomeModule {}
