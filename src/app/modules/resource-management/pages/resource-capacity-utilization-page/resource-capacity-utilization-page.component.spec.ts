import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResourceCapacityUtilizationService } from 'src/app/core/http/resource-capacity-utilization/resource-capacity-utilization.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { resourceCapacityUtilizationMock } from 'src/app/test/mocks/resource-capacity-utilization.mock';
import { Spied } from 'src/app/test/models/spied.type';
import { ResourceManagementModule } from '../../resource-management.module';

import { ResourceCapacityUtilizationPageComponent } from './resource-capacity-utilization-page.component';

describe('ResourceCapacityUtilizationPageComponent', () => {
  let component: ResourceCapacityUtilizationPageComponent;
  let fixture: ComponentFixture<ResourceCapacityUtilizationPageComponent>;

  const resourceCapacityUtilizationServiceStub = jasmine.createSpyObj(
    'ResourceCapacityUtilizationService',
    ['fetchItems']
  ) as Spied<ResourceCapacityUtilizationService>;

  resourceCapacityUtilizationServiceStub.fetchItems.and.returnValue({
    count: 1,
    items: [resourceCapacityUtilizationMock],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        ResourceManagementModule,
      ],
      providers: [
        {
          provide: ResourceCapacityUtilizationService,
          useValue: resourceCapacityUtilizationServiceStub,
        },
        DatePipe,
      ],
      declarations: [ResourceCapacityUtilizationPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceCapacityUtilizationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
