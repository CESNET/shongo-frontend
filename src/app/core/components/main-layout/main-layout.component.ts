import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ResourceService } from '../../http/resource/resource.service';

/**
 * Defines main app layout, pages are rendered inside this component.
 */
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  constructor(public resourceService: ResourceService) {}
}
