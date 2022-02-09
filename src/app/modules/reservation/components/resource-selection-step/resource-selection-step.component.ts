import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  PhysicalResource,
  physicalResources,
} from 'src/app/models/data/physical-resources';
import { PhysicalResourceType } from 'src/app/models/enums/physical-resource-type.enum';

type ResourceTypeButton = {
  type: PhysicalResourceType;
  name: string;
  icon: string;
};

@Component({
  selector: 'app-resource-selection-step',
  templateUrl: './resource-selection-step.component.html',
  styleUrls: ['./resource-selection-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // animations: [
  //   trigger('buttonAnimation', [
  //     transition(':enter', [
  //       query('.type-button', [
  //         style({ opacity: 0, transform: 'translateY(50px)' }),
  //         stagger(30, [
  //           animate(
  //             '500ms cubic-bezier(0.35, 0, 0.25, 1)',
  //             style({ opacity: 1, transform: 'none' })
  //           ),
  //         ]),
  //       ]),
  //     ]),
  //   ]),
  // ],
})
export class ResourceSelectionStepComponent implements OnInit, OnDestroy {
  selectedResource$ = new BehaviorSubject<string | null>(null);
  selectedResourceType = PhysicalResourceType.MEETING_ROOM;
  showTypes = true;
  resourceControl = new FormControl(null, [Validators.required]);

  resourceTypeButtons: ResourceTypeButton[] = [
    {
      type: PhysicalResourceType.MEETING_ROOM,
      name: 'Meeting room',
      icon: 'groups',
    },
    {
      type: PhysicalResourceType.PARKING_PLACE,
      name: 'Parking place',
      icon: 'directions_car_filled',
    },
  ];

  resourceFilterCtrl = new FormControl();

  private _destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.resourceControl;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getResourcesByType(type: PhysicalResourceType): PhysicalResource[] {
    const filter = this.resourceFilterCtrl.value;
    return physicalResources.filter(
      (resource) =>
        resource.type === type && (!filter || resource.name.includes(filter))
    );
  }

  isCompleted(): boolean {
    return this.resourceControl.valid;
  }

  backToTypeSelection(): void {
    this.selectedResourceType = PhysicalResourceType.MEETING_ROOM;
    this.showTypes = true;
  }

  handleResourceTypeClick(type: PhysicalResourceType): void {
    this.resourceControl.reset();
    this.selectedResourceType = type;
    this.showTypes = false;
  }

  emitSelectedResource(resourceId: string): void {
    this.selectedResource$.next(resourceId);
  }
}
