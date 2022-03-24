import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Resource, resources } from 'src/app/models/data/resources';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';

@Component({
  selector: 'app-resource-selection-form',
  templateUrl: './resource-selection-form.component.html',
  styleUrls: ['./resource-selection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceSelectionFormComponent {
  @Output() resourceChange = new EventEmitter<Resource | null>();

  readonly form = new FormGroup({
    type: new FormControl(ResourceType.MEETING_ROOM),
    resource: new FormControl(),
  });

  readonly resourceTypes: Option[] = [
    { value: ResourceType.VIRTUAL_ROOM, displayName: 'Virtual room' },
    { value: ResourceType.PARKING_PLACE, displayName: 'Parking place' },
    { value: ResourceType.MEETING_ROOM, displayName: 'Meeting room' },
  ];

  readonly resourceFilterCtrl = new FormControl();

  constructor() {}

  getResourcesByType(): Resource[] {
    const filter = this.resourceFilterCtrl.value;
    const type = this.form.get('type')!.value;

    return resources.filter(
      (resource) =>
        resource.type === type && (!filter || resource.name.includes(filter))
    );
  }

  emitSelectedResource(resource: Resource | null): void {
    this.resourceChange.emit(resource);
  }
}
