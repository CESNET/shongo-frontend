import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  AuthConfig,
  OAuthModule,
  OAuthModuleConfig,
  OAuthStorage,
} from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../shared/shared.module';
import { appInitializerFactory } from './app-initializer.factory';
import { authConfig as devAuthConfig } from './authentication/auth-dev.config';
import { authModuleConfig } from './authentication/auth-module.config';
import { authConfig as prodAuthConfig } from './authentication/auth-prod.config';
import { AuthenticationService } from './authentication/authentication.service';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { UnauthorizedPageComponent } from './components/unauthorized-page/unauthorized-page.component';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
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
    LayoutModule,
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
          useFactory: appInitializerFactory,
          deps: [AuthenticationService, ResourceService],
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
