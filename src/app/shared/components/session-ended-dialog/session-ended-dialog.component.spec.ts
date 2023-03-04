/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { SessionEndedDialogComponent } from './session-ended-dialog.component';

describe('SessionEndedDialogComponent', () => {
  let component: SessionEndedDialogComponent;
  let fixture: ComponentFixture<SessionEndedDialogComponent>;

  const authServiceStub = { login: () => {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionEndedDialogComponent],
      imports: [MatDialogModule, MatButtonModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionEndedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
