import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '../../authentication/authentication.service';
import { of } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/app/test/components/dummy.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const authStub = jasmine.createSpyObj('AuthenticationService', ['login'], {
    isAuthenticated$: of(true),
  });
  authStub.login.and.returnValue(Promise.resolve());

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
          useValue: authStub as AuthenticationService,
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
