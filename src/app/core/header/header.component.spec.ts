import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '../authentication/authentication.service';
import { of } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/app/test/components/dummy.component';
import { FlexLayoutModule } from '@angular/flex-layout';

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
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        SharedModule,
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
