import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { first, takeUntil } from 'rxjs/operators';
import { ReservationService } from 'src/app/core/http/reservation/reservation.service';
import { Reservation } from 'src/app/shared/models/rest-api/reservation.interface';
import { format } from 'date-fns';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';

type SelectOption = { value: string; display: string };

@Component({
  selector: 'app-reservation-calendar',
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('loading', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', animate('200ms ease', style({ opacity: 0 }))),
    ]),
  ],
})
export class ReservationCalendarComponent implements OnInit, OnDestroy {
  // For usage in template.
  CalendarView = CalendarView;

  // Date where calendar starts.
  viewDate = new Date();

  // Current calendar view.
  view: CalendarView = CalendarView.Month;

  resources: SelectOption[] = [
    { value: 'G318', display: 'Malá zasedačka (Gotex, G318)' },
    { value: 'G317', display: 'Velká zasedačka (Gotex, G317)' },
    { value: 'C023', display: 'Klub ÚVT (Botanická, C023)' },
    { value: 'G331', display: 'Zasedačka ÚVT (Gotex, G331)' },
    { value: 'G367', display: 'Zasedačka u ředitelny (Gotex, G367)' },
    { value: 'P20', display: 'Šumavská 20 - Parkovací místo' },
    { value: 'P84', display: 'Šumavská 84 - Parkovací místo' },
  ];
  filteredResources = this.resources;

  filterGroup = new FormGroup({
    resource: new FormControl(this.resources[0].value),
    highlightMine: new FormControl(false),
    resourceFilter: new FormControl(''),
  });

  events: CalendarEvent[] = [];

  loading$: Observable<boolean>;
  private _destroy$ = new Subject<void>();
  private _loading$ = new BehaviorSubject<boolean>(true);

  constructor(private _reservationService: ReservationService) {
    this.loading$ = this._loading$.asObservable();
  }

  ngOnInit(): void {
    this.fetchReservations();

    const resourceFilter = this.filterGroup.get(
      'resourceFilter'
    ) as FormControl;
    resourceFilter.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((filter) => {
        this._filterResources(filter);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  fetchReservations(): void {
    this._loading$.next(true);

    this._reservationService
      .fetchReservations(this.filterGroup.get('resource')!.value)
      .pipe(first())
      .subscribe({
        next: (reservations) => {
          this._loading$.next(false);
          this._setEvents(reservations);
        },
        error: () => {
          this._loading$.next(false);
        },
      });
  }

  refresh(): void {
    this._loading$.next(true);
    setTimeout(() => this.fetchReservations(), 200);
  }

  private _filterResources(filter: string): void {
    this.filteredResources = this.resources.filter((resource) =>
      resource.display.toLowerCase().includes(filter.toLowerCase())
    );
  }

  private _setEvents(reservations: ApiResponse<Reservation>) {
    this.events = reservations.items.map((reservation) => ({
      start: new Date(reservation.slotStart),
      end: new Date(reservation.slotEnd),
      title: `${reservation.description} <i>(${this._getSlot(
        reservation
      )})</i>`,
      meta: {
        owner: reservation.owner,
        ownerEmail: reservation.ownerEmail,
      },
    }));
  }

  private _getSlot(reservation: Reservation): string {
    const startTime = format(new Date(reservation.slotStart), 'HH:mm');
    const endTime = format(new Date(reservation.slotEnd), 'HH:mm');
    return `${startTime} - ${endTime}`;
  }
}
