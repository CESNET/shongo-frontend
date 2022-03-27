import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceUtilizationDetailPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: HttpClient, useValue: httpClientStub },
        DatePipe,
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
