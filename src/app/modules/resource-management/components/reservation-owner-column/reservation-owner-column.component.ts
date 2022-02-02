import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ColumnComponent,
  SETTINGS_PROVIDER,
  VALUE_PROVIDER,
} from 'src/app/shared/components/data-table/column-components/column.component';
import { TableSettings } from 'src/app/shared/components/data-table/filter/data-table-filter';
import { ResourceOwner } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';

@Component({
  selector: 'app-reservation-owner-column',
  templateUrl: './reservation-owner-column.component.html',
  styleUrls: ['./reservation-owner-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationOwnerColumnComponent extends ColumnComponent {
  owner: ResourceOwner;

  constructor(
    @Inject(VALUE_PROVIDER) value: string,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(value, settings);
    this.owner = JSON.parse(value);
  }
}
