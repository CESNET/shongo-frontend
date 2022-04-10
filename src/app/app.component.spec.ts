import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { AuthenticationService } from './core/authentication/authentication.service';
import { AuthServiceStub } from './test/stubs/auth-service.stub';

describe('AppComponent', () => {
  const authServiceStub = new AuthServiceStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule],
      declarations: [AppComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceStub },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
