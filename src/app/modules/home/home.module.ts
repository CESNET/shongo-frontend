import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [HomePageComponent],
  imports: [CommonModule, MaterialModule],
})
export class HomeModule {}
