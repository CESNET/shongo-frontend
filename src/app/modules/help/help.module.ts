import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HelpPageComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
})
export class HelpModule {}
