import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdvancedSettingsFormComponent } from '@app/modules/reservation-forms/components/advanced-settings-form/advanced-settings-form.component';
import { TagType } from '@app/shared/models/enums/tag-type.enum';
import { Tag } from '@app/shared/models/rest-api/tag.interface';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { PhysicalResourceReservationFormComponent } from 'src/app/modules/reservation-forms/components/physical-resource-reservation-form/physical-resource-reservation-form.component';
import { TeleconferenceReservationFormComponent } from 'src/app/modules/reservation-forms/components/teleconference-reservation-form/teleconference-reservation-form.component';
import { VideoconferenceReservationFormComponent } from 'src/app/modules/reservation-forms/components/videoconference-reservation-form/videoconference-reservation-form.component';
import { WebconferenceReservationFormComponent } from 'src/app/modules/reservation-forms/components/webconference-reservation-form/webconference-reservation-form.component';
import { VirtualRoomReservationForm } from 'src/app/modules/reservation-forms/interfaces/virtual-room-reservation-form.interface';
import { ComponentHostDirective } from 'src/app/shared/directives/component-host.directive';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { Resource } from 'src/app/shared/models/rest-api/resource.interface';
import { CalendarSlot } from 'src/app/shared/models/rest-api/slot.interface';
import { ReservationForm } from '../../../reservation-forms/interfaces/reservation-form.interface';

/**
 * Dialog which creates reservtion form based on reserved resource
 * and handles the reservation process.
 */
@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDialogComponent implements OnInit {
  /**
   * Component into which the reservation form gets rendered.
   */
  @ViewChild(ComponentHostDirective, { static: true })
  formHost!: ComponentHostDirective;

  @ViewChild(AdvancedSettingsFormComponent, { static: true })
  advancedSettingsForm!: AdvancedSettingsFormComponent;

  /**
   * Reservation form component.
   */
  formComponent!: ReservationForm;

  /**
   * Whether advanced settings are being edited.
   * Used to show/hide advanced settings form.
   */
  editingAdvancedSettings = false;

  /**
   * Tags that can be configured in "Advanced settings" like NOTIFY_EMAIL.
   */
  readonly configurableTags: Tag[];

  readonly creating$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: {
      resource: Resource;
      slot: CalendarSlot;
      parentRequest: ReservationRequestDetail;
    },
    private _dialogRef: MatDialogRef<ReservationDialogComponent>,
    private _resReqService: ReservationRequestService,
    private _alert: AlertService
  ) {
    this.configurableTags = this._getConfigurableTags(this._data.resource);
  }

  ngOnInit(): void {
    this.renderFormComponent();
  }

  /**
   * Creates reservation request.
   */
  createReservationRequest(): void {
    this.creating$.next(true);

    this._createReservationRequest()
      .pipe(first())
      .subscribe({
        next: ({ id }) => {
          this.creating$.next(false);
          this._alert.showSuccess(
            $localize`:success message:Reservation request created`
          );
          this._dialogRef.close(id);
        },
        error: () => {
          this.creating$.next(false);
          this._alert.showError(
            $localize`:error message:Failed to create reservation request`
          );
        },
      });
  }

  /**
   * Renders a form component based on reserved resource into the host element.
   */
  renderFormComponent(): void {
    let component: Type<ReservationForm>;

    if (this._data.resource.type === ResourceType.PHYSICAL_RESOURCE) {
      component = PhysicalResourceReservationFormComponent;
    } else if (this._data.resource.type === ResourceType.VIRTUAL_ROOM) {
      if (
        this._data.resource.technology === Technology.PEXIP ||
        this._data.resource.technology === Technology.H323_SIP
      ) {
        component = VideoconferenceReservationFormComponent;
      } else if (this._data.resource.technology === Technology.ADOBE_CONNECT) {
        component = WebconferenceReservationFormComponent;
      } else if (this._data.resource.technology === Technology.FREEPBX) {
        component = TeleconferenceReservationFormComponent;
      } else {
        throw new Error(
          'Unsupported technology: ' + this._data.resource.technology
        );
      }
    } else {
      throw new Error('Unsupported resource type: ' + this._data.resource.type);
    }

    const viewContainerRef = this.formHost.viewContainerRef;
    viewContainerRef.clear();
    this.formComponent =
      viewContainerRef.createComponent<ReservationForm>(component).instance;

    // Initialize capacity booking mode for dialog.
    if (
      this._data.resource.type === ResourceType.VIRTUAL_ROOM &&
      this._data.parentRequest
    ) {
      (this.formComponent as VirtualRoomReservationForm).editingMode = true;
    }
  }

  toggleAdvancedSettings(): void {
    this.editingAdvancedSettings = !this.editingAdvancedSettings;
  }

  /**
   * Creates reservation request body and posts it to the backend.
   *
   * @returns Observable of API response.
   */
  private _createReservationRequest(): Observable<{ id: string }> {
    const { timezone, ...rest } = this.formComponent.getFormValue();
    const tags = this.advancedSettingsForm.getValue();
    const auxData = tags.map((tag) => ({
      tagName: tag.name,
      enabled: true,
      data: tag.data,
    }));
    let reservationRequestBase;

    if (this._data.parentRequest) {
      reservationRequestBase = {
        roomReservationRequestId: this._data.parentRequest.id,
        type: ReservationType.ROOM_CAPACITY,
      };
    } else {
      const type =
        this._data.resource.type === ResourceType.PHYSICAL_RESOURCE
          ? ReservationType.PHYSICAL_RESOURCE
          : ReservationType.VIRTUAL_ROOM;
      reservationRequestBase = { resource: this._data.resource.id, type };
    }

    const reservationRequest = {
      slot: {
        start: this._changeTimeZone(
          moment(this._data.slot.start),
          timezone
        ).toISOString(),
        end: this._changeTimeZone(
          moment(this._data.slot.end),
          timezone
        ).toISOString(),
      },
      auxData,
      ...reservationRequestBase,
      ...rest,
    };
    return this._resReqService.postItem<unknown, { id: string }>(
      reservationRequest
    );
  }

  /**
   * Changes timezone of a given date, but keeps date the same.
   *
   * @param date Date.
   * @param timezone Timezone.
   * @returns Date with changed timezone.
   */
  private _changeTimeZone(
    date: moment.Moment,
    timezone: string
  ): moment.Moment {
    return moment.tz(date.format('YYYY-MM-DDTHH:mm:ss'), timezone);
  }

  private _getConfigurableTags(resource: Resource): Tag[] {
    return resource.tags?.filter((tag) => tag.type !== TagType.DEFAULT) ?? [];
  }
}
