import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { DummyComponent } from 'src/app/test/components/dummy.component';
import { AuthServiceStub } from 'src/app/test/stubs/auth-service.stub';
import { SettingsServiceStub } from 'src/app/test/stubs/settings-service.stub';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SettingsService } from '../../http/settings/settings.service';
import { HeaderComponent } from './header.component';

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
