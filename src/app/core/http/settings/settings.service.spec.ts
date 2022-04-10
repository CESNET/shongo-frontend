import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { HttpClient } from '@angular/common/http';
import { AuthServiceStub } from 'src/app/test/stubs/auth-service.stub';
import { AuthenticationService } from '../../authentication/authentication.service';
import { AlertServiceStub } from 'src/app/test/stubs/alert-service.stub';
import { AlertService } from '../../services/alert.service';

describe('SettingsService', () => {
  let service: SettingsService;

  const authServiceStub = new AuthServiceStub();
  const alertServiceStub = new AlertServiceStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientStub },
        { provide: AuthenticationService, useValue: authServiceStub },
        { provide: AlertService, useValue: alertServiceStub },
      ],
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
