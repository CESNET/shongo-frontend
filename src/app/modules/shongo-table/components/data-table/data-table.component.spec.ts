import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DataTableDatasourceStub,
  DataTableDataStub,
} from 'src/app/test/stubs/data-table-datasource.stub';
import { ShongoTableModule } from '../../shongo-table.module';
import { DataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent<DataTableDataStub>;
  let fixture: ComponentFixture<DataTableComponent<DataTableDataStub>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableComponent],
      imports: [
        ReactiveFormsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        NoopAnimationsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        MatIconModule,
        ShongoTableModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent) as ComponentFixture<
      DataTableComponent<DataTableDataStub>
    >;
    component = fixture.componentInstance;
    component.dataSource = new DataTableDatasourceStub();
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
