import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/app/test/components/dummy.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { SettingsServiceStub } from 'src/app/test/stubs/settings-service.stub';
import { SettingsService } from '../../http/settings/settings.service';
import { AuthServiceStub } from 'src/app/test/stubs/auth-service.stub';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const authStub = new AuthServiceStub();
  const settingsServiceStub = new SettingsServiceStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FlexLayoutModule,
        SharedModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatRippleModule,
        RouterTestingModule.withRoutes([
          {
            path: '**',
            component: DummyComponent,
          },
        ]),
      ],
      declarations: [HeaderComponent],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authStub,
        },
        {
          provide: SettingsService,
          useValue: settingsServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
