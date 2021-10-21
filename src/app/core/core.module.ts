import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../modules/material.module';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  exports: [HeaderComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
