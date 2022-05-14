import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AuthConfig,
  OAuthModule,
  OAuthModuleConfig,
  OAuthStorage,
} from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { environment } from 'src/environments/environment';
import { authConfig as prodAuthConfig } from './authentication/auth-prod.config';
import { authConfig as devAuthConfig } from './authentication/auth-dev.config';
import { authModuleConfig } from './authentication/auth-module.config';
import { AuthenticationService } from './authentication/authentication.service';
import { UnauthorizedPageComponent } from './components/unauthorized-page/unauthorized-page.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { authAppInitializerFactory } from './authentication/auth-app-initializer.factory';
import { resourceInitializerFactory } from './http/resource/resource-initializer-factory';
import { ResourceService } from './http/resource/resource.service';

export function storageFactory(): OAuthStorage {
  return localStorage;
}

/**
 * Core module takes on the role of root module, but is not the module
 * which gets bootstrapped by Angular run-time.
 */
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    UnauthorizedPageComponent,
    MainLayoutComponent,
  ],
  exports: [HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatToolbarModule,
    MatDividerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    OAuthModule.forRoot(),
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: authAppInitializerFactory,
          deps: [AuthenticationService],
          multi: true,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: resourceInitializerFactory,
          deps: [ResourceService],
          multi: true,
        },
        { provide: OAuthStorage, useFactory: storageFactory },
        {
          provide: AuthConfig,
          useValue: environment.production ? prodAuthConfig : devAuthConfig,
        },
        { provide: OAuthModuleConfig, useValue: authModuleConfig },
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
