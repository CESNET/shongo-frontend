import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import {
  ColumnComponent,
  VALUE_PROVIDER,
} from 'src/app/shared/components/data-table/column-components/column.component';

@Component({
  selector: 'app-percentage-column',
  templateUrl: './percentage-column.component.html',
  styleUrls: ['./percentage-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentageColumnComponent extends ColumnComponent {
  background?: string;

  constructor(@Inject(VALUE_PROVIDER) value: string) {
    super(value);
    this.background = this.calculateBackground(Number(value));
  }

  calculateBackground(value: number): string | undefined {
    if (value < 0.1) {
      const all = 255 - 30 * (value * 10);
      return `rgb(${all}, ${all}, ${all})`;
    } else {
      const green = 220 - 165 * value;
      return `rgb(255, ${green}, 55)`;
    }
  }
}
