import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { DataTableComponent } from './data-table.component';
import { DataTableDatasourceStub } from 'src/app/test/stubs/data-table-datasource.stub';
import { MaterialModule } from 'src/app/modules/material.module';
import { HasID } from 'src/app/models/has-id.interface';

describe('DataTableComponent', () => {
  let component: DataTableComponent<HasID>;
  let fixture: ComponentFixture<DataTableComponent<HasID>>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DataTableComponent],
        imports: [
          NoopAnimationsModule,
          MatPaginatorModule,
          MatSortModule,
          MatTableModule,
          MaterialModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.dataSource = new DataTableDatasourceStub();
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
