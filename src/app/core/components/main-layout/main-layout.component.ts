import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ResourceService } from '../../http/resource/resource.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  constructor(public resourceService: ResourceService) {}
}
