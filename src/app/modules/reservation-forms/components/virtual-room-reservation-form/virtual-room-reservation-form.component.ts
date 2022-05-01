import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import {
  Resource,
  VirtualRoomResource,
} from 'src/app/shared/models/rest-api/resource.interface';
import { VirtualRoomReservationRequest } from 'src/app/shared/models/rest-api/virtual-room-reservation-request.interfacet';
import { getFormError } from 'src/app/utils/getFormError';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';
import { ReservationForm } from '../../interfaces/reservation-form.interface';
import {
  descriptionErrorHandler,
  pinErrorHandler,
  roomNameErrorHandler,
} from '../../utils/custom-error-handlers';
import {
  PIN_PATTERN,
  PIN_MINLENGTH,
} from '../../utils/reservation-form.constants';

@Component({
  selector: 'app-virtual-room-reservation-form',
  templateUrl: './virtual-room-reservation-form.component.html',
  styleUrls: ['./virtual-room-reservation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualRoomReservationFormComponent
  implements ReservationForm, OnInit
{
  @Input() editedRequest?: ReservationRequestDetail | undefined;

  readonly form = new FormGroup({
    resource: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    roomName: new FormControl(null, [Validators.required]),
    timezone: new FormControl(null, [Validators.required]),
    videoconferenceFields: new FormGroup({
      adminPin: new FormControl(null, [
        Validators.pattern(PIN_PATTERN),
        Validators.minLength(PIN_MINLENGTH),
      ]),
      allowGuests: new FormControl(false, [Validators.required]),
    }),
    webconferenceFields: new FormGroup({
      userPin: new FormControl(null, [
        Validators.pattern(PIN_PATTERN),
        Validators.minLength(PIN_MINLENGTH),
      ]),
    }),
    teleconferenceFields: new FormGroup({
      adminPin: new FormControl(null, [
        Validators.pattern(PIN_PATTERN),
        Validators.minLength(PIN_MINLENGTH),
      ]),
      userPin: new FormControl(null, [
        Validators.pattern(PIN_PATTERN),
        Validators.minLength(PIN_MINLENGTH),
      ]),
    }),
  });

  readonly pinErrorHandler = pinErrorHandler;
  readonly roomNameErrorHandler = roomNameErrorHandler;
  readonly descriptionErrorHandler = descriptionErrorHandler;
  readonly getFormError = getFormError;
  readonly Technology = Technology;

  readonly technologyOpts: Option[];

  constructor(
    private _resourceService: ResourceService,
    private _settings: SettingsService
  ) {
    this.technologyOpts = this._createTechnologyOpts();
    this.form.patchValue({ timezone: this._settings.timeZone });
  }

  get videoconferenceFieldsForm(): FormGroup {
    return this.form.get('videoconferenceFields') as FormGroup;
  }

  get webconferenceFieldsForm(): FormGroup {
    return this.form.get('webconferenceFields') as FormGroup;
  }

  get teleconferenceFieldsForm(): FormGroup {
    return this.form.get('teleconferenceFields') as FormGroup;
  }

  get valid(): boolean {
    return this.form.valid;
  }

  ngOnInit(): void {
    if (this.editedRequest) {
      this.fill(this.editedRequest);
    }
  }

  fill({
    description,
    virtualRoomData,
    authorizedData,
  }: ReservationRequestDetail): void {
    if (description) {
      this.form.get('description')!.setValue(description);
    }

    let resource: Resource | null = null;

    if (virtualRoomData) {
      const { roomResourceId, roomName } = virtualRoomData;

      if (roomResourceId) {
        resource = this._resourceService.findResourceById(roomResourceId);

        if (resource) {
          this.form.get('resource')!.setValue(roomResourceId);
        }
      }
      if (roomName) {
        this.form.get('roomName')!.setValue(roomName);
      }
    }

    if (authorizedData && resource) {
      if (
        resource.technology === Technology.PEXIP ||
        resource.technology === Technology.H323_SIP
      ) {
        if (authorizedData.adminPin) {
          this.videoconferenceFieldsForm
            .get('adminPin')!
            .setValue(authorizedData.adminPin);
        }
        if (authorizedData.allowGuests) {
          this.videoconferenceFieldsForm
            .get('allowGuests')!
            .setValue(authorizedData.allowGuests);
        }
      } else if (resource.technology === Technology.FREEPBX) {
        if (authorizedData.adminPin) {
          this.videoconferenceFieldsForm
            .get('adminPin')!
            .setValue(authorizedData.adminPin);
        }
        if (authorizedData.userPin) {
          this.videoconferenceFieldsForm
            .get('userPin')!
            .setValue(authorizedData.userPin);
        }
      } else if (resource.technology === Technology.ADOBE_CONNECT) {
        if (authorizedData.userPin) {
          this.videoconferenceFieldsForm
            .get('userPin')!
            .setValue(authorizedData.userPin);
        }
      }
    }
  }

  getFormValue(): VirtualRoomReservationRequest {
    const {
      resource: resourceId,
      videoconferenceFields,
      teleconferenceFields,
      webconferenceFields,
      ...rest
    } = this.form.value;

    const resource = this._resourceService.findResourceById(resourceId);

    if (!resource) {
      throw new Error('Resource not found.');
    }

    if (
      resource.technology === Technology.PEXIP ||
      resource.technology === Technology.H323_SIP
    ) {
      return { resource: resource.id, ...videoconferenceFields, ...rest };
    } else if (resource.technology === Technology.ADOBE_CONNECT) {
      return { resource: resource.id, ...webconferenceFields, ...rest };
    } else if (resource.technology === Technology.FREEPBX) {
      return { resource: resource.id, ...teleconferenceFields, ...rest };
    } else {
      throw new Error('Unsupported technology.');
    }
  }

  getSelectedTechnology(): Technology | null {
    const selectedResource = this.form.get('technology')?.value;

    if (!selectedResource) {
      return null;
    }

    return selectedResource.technology;
  }

  onTechnologyChange(selectedResource: VirtualRoomResource): void {
    switch (selectedResource.technology) {
      case Technology.PEXIP:
      case Technology.H323_SIP:
        this.videoconferenceFieldsForm.enable();
        this.webconferenceFieldsForm.disable();
        this.teleconferenceFieldsForm.disable();
        break;
      case Technology.ADOBE_CONNECT:
        this.webconferenceFieldsForm.enable();
        this.videoconferenceFieldsForm.disable();
        this.teleconferenceFieldsForm.disable();
        break;
      case Technology.FREEPBX:
        this.teleconferenceFieldsForm.enable();
        this.webconferenceFieldsForm.disable();
        this.videoconferenceFieldsForm.disable();
        break;
      default:
        this.teleconferenceFieldsForm.disable();
        this.webconferenceFieldsForm.disable();
        this.videoconferenceFieldsForm.disable();
    }
  }

  private _createTechnologyOpts(): Option[] {
    const resources = this._resourceService.getVirtualRoomResources();

    return resources
      .map((res) => ({
        value: res.id,
        displayName: virtualRoomResourceConfig.technologyNameMap.get(
          res.technology
        ),
      }))
      .filter((opt) => opt.displayName) as Option[];
  }
}
