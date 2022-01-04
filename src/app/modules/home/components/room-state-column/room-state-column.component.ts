import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  ColumnComponent,
  VALUE_PROVIDER,
} from '../../../../shared/components/data-table/column-components/column.component';

@Component({
  selector: 'app-room-state-column',
  templateUrl: './room-state-column.component.html',
  styleUrls: ['./room-state-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomStateColumnComponent extends ColumnComponent {
  constructor(@Inject(VALUE_PROVIDER) value: string) {
    super(value);
  }
}
