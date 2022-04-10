import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ShongoTableModule } from 'src/app/modules/shongo-table/shongo-table.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CertainityDialogStub } from 'src/app/test/stubs/certainity-dialog.stub';

import { UserRolesTabComponent } from './user-roles-tab.component';

describe('UserRolesTabComponent', () => {
  let component: UserRolesTabComponent;
  let fixture: ComponentFixture<UserRolesTabComponent>;

  const mockRoute = {
    params: of({ id: 'shongo:meetings.cesnet.cz:req:1' }),
  };
  const resReqServiceStub = {
    fetchUserRoles: () => of({ count: 0, items: [] }),
  };
  const dialogStub = new CertainityDialogStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule,
        MatIconModule,
        ShongoTableModule,
      ],
      declarations: [UserRolesTabComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ReservationRequestService, useValue: resReqServiceStub },
        { provide: MatDialog, useValue: dialogStub },
        DatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
