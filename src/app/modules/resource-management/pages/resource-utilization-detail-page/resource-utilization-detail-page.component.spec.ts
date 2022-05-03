import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { of } from 'rxjs';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ShongoTableModule } from 'src/app/modules/shongo-table/shongo-table.module';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { resourceUtilizationDetailMock } from 'src/app/test/mocks/resource-utilization-detail.mock';
import { Spied } from 'src/app/test/models/spied.type';
import { ResourceUtilizationDetailPageComponent } from './resource-utilization-detail-page.component';

describe('ResourceUtilizationDetailPageComponent', () => {
  let component: ResourceUtilizationDetailPageComponent;
  let fixture: ComponentFixture<ResourceUtilizationDetailPageComponent>;

  const mockRoute = {
    queryParams: of({
      intervalFrom: '',
      intervalTo: '',
      resourceId: '',
    }),
  };

  const resourceServiceStub = jasmine.createSpyObj('ResourceService', [
    'fetchResourceUtilization',
  ]) as Spied<ResourceService>;

  resourceServiceStub.fetchResourceUtilization.and.returnValue(
    resourceUtilizationDetailMock
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ShongoTableModule,
        NoopAnimationsModule,
        NgxSkeletonLoaderModule,
        SharedModule,
      ],
      declarations: [ResourceUtilizationDetailPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ResourceService, useValue: resourceServiceStub },
        MomentDatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceUtilizationDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
