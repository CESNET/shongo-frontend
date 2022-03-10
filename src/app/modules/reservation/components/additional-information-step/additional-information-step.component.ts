import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { physicalResources } from 'src/app/models/data/physical-resources';
import { TimeSlot } from 'src/app/shared/models/rest-api/time-slot.interface';

@Component({
  selector: 'app-additional-information-step',
  templateUrl: './additional-information-step.component.html',
  styleUrls: ['./additional-information-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalInformationStepComponent {
  @Input() selectedResourceId?: string | null;
  @Input() selectedTimeSlot?: TimeSlot;
  @Input() selectedPeriodicity?: string;

  descriptionControl = new FormControl(null, [Validators.required]);

  constructor() {}

  getResourceNameById(): string | null {
    if (!this.selectedResourceId) {
      return null;
    }
    return (
      physicalResources.find(
        (resource) => resource.id === this.selectedResourceId
      )?.name ?? null
    );
  }
}
