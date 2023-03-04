import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ShongoTableModule } from 'src/app/modules/shongo-table/shongo-table.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RuntimeManagementTabComponent } from './runtime-management-tab.component';

describe('RuntimeManagementTabComponent', () => {
  let component: RuntimeManagementTabComponent;
  let fixture: ComponentFixture<RuntimeManagementTabComponent>;

  const resReqServiceStub = {
    fetchRuntimeParticipants: () => of({ count: 0, items: [] }),
  };
  const mockRoute = { snapshot: { params: { id: '1' } } };
  const dialogStub = { open: () => null };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuntimeManagementTabComponent],
      imports: [SharedModule, NoopAnimationsModule, ShongoTableModule],
      providers: [
        { provide: ReservationRequestService, useValue: resReqServiceStub },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatDialog, useValue: dialogStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeManagementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
